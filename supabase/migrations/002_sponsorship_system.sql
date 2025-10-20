-- Sponsorship System for Pilot Server
-- Adds sponsorship tiers, quotas, and usage tracking

-- Sponsorship Tiers Table
CREATE TABLE IF NOT EXISTS sponsorship_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    monthly_cost DECIMAL(10, 2) NOT NULL,
    storage_quota_gb DECIMAL(10, 2) NOT NULL,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sponsorships Table
CREATE TABLE IF NOT EXISTS user_sponsorships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier_id UUID REFERENCES sponsorship_tiers(id),
    github_sponsor_username TEXT, -- The sponsor's GitHub username for verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Storage Usage Table
CREATE TABLE IF NOT EXISTS storage_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chats_size_bytes BIGINT DEFAULT 0,
    messages_size_bytes BIGINT DEFAULT 0,
    embeddings_size_bytes BIGINT DEFAULT 0,
    total_size_bytes BIGINT DEFAULT 0,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Insert default sponsorship tiers
INSERT INTO sponsorship_tiers (name, monthly_cost, storage_quota_gb, features) VALUES
('Free', 0.00, 0, '{"database": false, "rag": false, "localStorage": true}'),
('Supporter', 5.00, 1, '{"database": true, "rag": false, "localStorage": true}'),
('Pro', 10.00, 5, '{"database": true, "rag": true, "localStorage": true}'),
('Power', 25.00, 20, '{"database": true, "rag": true, "localStorage": true, "priority_support": true}')
ON CONFLICT (name) DO NOTHING;

-- Add sponsorship columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS sponsorship_tier TEXT DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS storage_used_gb DECIMAL(10, 4) DEFAULT 0,
ADD COLUMN IF NOT EXISTS storage_quota_gb DECIMAL(10, 2) DEFAULT 0;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sponsorships_user_id ON user_sponsorships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sponsorships_verified ON user_sponsorships(is_verified);
CREATE INDEX IF NOT EXISTS idx_storage_usage_user_id ON storage_usage(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE sponsorship_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_usage ENABLE ROW LEVEL SECURITY;

-- Sponsorship Tiers (public read)
CREATE POLICY "Anyone can view sponsorship tiers"
    ON sponsorship_tiers FOR SELECT
    USING (true);

-- User Sponsorships (user can see their own)
CREATE POLICY "Users can view their own sponsorship"
    ON user_sponsorships FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sponsorship"
    ON user_sponsorships FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sponsorship"
    ON user_sponsorships FOR UPDATE
    USING (auth.uid() = user_id);

-- Storage Usage (user can see their own)
CREATE POLICY "Users can view their own storage usage"
    ON storage_usage FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own storage usage"
    ON storage_usage FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own storage usage"
    ON storage_usage FOR UPDATE
    USING (auth.uid() = user_id);

-- Function to calculate user storage
CREATE OR REPLACE FUNCTION calculate_user_storage(user_uuid UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_bytes BIGINT := 0;
    chats_bytes BIGINT := 0;
    messages_bytes BIGINT := 0;
    embeddings_bytes BIGINT := 0;
BEGIN
    -- Calculate chats size
    SELECT COALESCE(SUM(octet_length(title)), 0) INTO chats_bytes
    FROM chats WHERE user_id = user_uuid;
    
    -- Calculate messages size
    SELECT COALESCE(SUM(octet_length(content)), 0) INTO messages_bytes
    FROM chat_messages WHERE user_id = user_uuid;
    
    -- Calculate embeddings size (approximate: vector + content + metadata)
    SELECT COALESCE(SUM(octet_length(content) + 6144 + octet_length(metadata::text)), 0) INTO embeddings_bytes
    FROM document_embeddings WHERE user_id = user_uuid;
    
    total_bytes := chats_bytes + messages_bytes + embeddings_bytes;
    
    -- Update or insert storage usage
    INSERT INTO storage_usage (user_id, chats_size_bytes, messages_size_bytes, embeddings_size_bytes, total_size_bytes, last_calculated_at)
    VALUES (user_uuid, chats_bytes, messages_bytes, embeddings_bytes, total_bytes, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        chats_size_bytes = EXCLUDED.chats_size_bytes,
        messages_size_bytes = EXCLUDED.messages_size_bytes,
        embeddings_size_bytes = EXCLUDED.embeddings_size_bytes,
        total_size_bytes = EXCLUDED.total_size_bytes,
        last_calculated_at = NOW(),
        updated_at = NOW();
    
    -- Update user profile with GB usage
    UPDATE user_profiles
    SET storage_used_gb = ROUND(total_bytes::DECIMAL / 1073741824, 4)
    WHERE id = user_uuid;
    
    RETURN total_bytes;
END;
$$;

-- Function to check if user has quota
CREATE OR REPLACE FUNCTION check_storage_quota(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_usage_gb DECIMAL;
    quota_gb DECIMAL;
BEGIN
    -- Get current usage and quota
    SELECT storage_used_gb, storage_quota_gb 
    INTO current_usage_gb, quota_gb
    FROM user_profiles
    WHERE id = user_uuid;
    
    -- Return true if under quota (or no quota set)
    RETURN quota_gb = 0 OR current_usage_gb < quota_gb;
END;
$$;

-- Trigger to update storage usage automatically
CREATE OR REPLACE FUNCTION update_storage_on_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Schedule storage recalculation (async)
    PERFORM calculate_user_storage(COALESCE(NEW.user_id, OLD.user_id));
    RETURN NEW;
END;
$$;

-- Create triggers for automatic storage calculation
DROP TRIGGER IF EXISTS trigger_update_storage_on_chat ON chats;
CREATE TRIGGER trigger_update_storage_on_chat
AFTER INSERT OR UPDATE OR DELETE ON chats
FOR EACH ROW EXECUTE FUNCTION update_storage_on_change();

DROP TRIGGER IF EXISTS trigger_update_storage_on_message ON chat_messages;
CREATE TRIGGER trigger_update_storage_on_message
AFTER INSERT OR UPDATE OR DELETE ON chat_messages
FOR EACH ROW EXECUTE FUNCTION update_storage_on_change();

DROP TRIGGER IF EXISTS trigger_update_storage_on_embedding ON document_embeddings;
CREATE TRIGGER trigger_update_storage_on_embedding
AFTER INSERT OR UPDATE OR DELETE ON document_embeddings
FOR EACH ROW EXECUTE FUNCTION update_storage_on_change();

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_sponsorship_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sponsorship_tiers_updated_at BEFORE UPDATE ON sponsorship_tiers
    FOR EACH ROW EXECUTE FUNCTION update_sponsorship_updated_at();

CREATE TRIGGER update_user_sponsorships_updated_at BEFORE UPDATE ON user_sponsorships
    FOR EACH ROW EXECUTE FUNCTION update_sponsorship_updated_at();

CREATE TRIGGER update_storage_usage_updated_at BEFORE UPDATE ON storage_usage
    FOR EACH ROW EXECUTE FUNCTION update_sponsorship_updated_at();
