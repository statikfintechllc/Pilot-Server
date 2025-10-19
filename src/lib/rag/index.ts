import { supabase } from '../supabase/client';
import { sponsorshipService } from '../supabase/sponsorship-service';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Note: In production, this should be done server-side
});

export interface RAGDocument {
  id?: string;
  content: string;
  metadata?: Record<string, unknown>;
  embedding?: number[];
}

/**
 * Generate embeddings for a given text using OpenAI's API
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Store a document with its embedding in the database
 */
export async function storeDocument(
  userId: string,
  content: string,
  metadata: Record<string, unknown> = {}
): Promise<string> {
  try {
    // Check if user can access RAG features
    const canAccess = await sponsorshipService.canAccessRAG(userId);
    if (!canAccess) {
      throw new Error('RAG features require Pro or Power tier sponsorship. Please upgrade.');
    }

    // Check quota
    const hasQuota = await sponsorshipService.hasQuota(userId);
    if (!hasQuota) {
      throw new Error('Storage quota exceeded. Please upgrade your tier for more storage.');
    }

    const embedding = await generateEmbedding(content);

    const { data, error } = await supabase
      .from('document_embeddings')
      .insert({
        user_id: userId,
        content,
        embedding,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;

    return data.id;
  } catch (error) {
    console.error('Error storing document:', error);
    throw new Error('Failed to store document');
  }
}

/**
 * Find similar documents using vector similarity search
 */
export async function findSimilarDocuments(
  userId: string,
  query: string,
  limit: number = 5
): Promise<RAGDocument[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);

    // Use Supabase's vector similarity search (requires pgvector extension)
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit,
      user_id_filter: userId,
    });

    if (error) {
      console.error('Vector search error:', error);
      // Fallback to simple text search if vector search is not available
      return await fallbackTextSearch(userId, query, limit);
    }

    return data || [];
  } catch (error) {
    console.error('Error finding similar documents:', error);
    return await fallbackTextSearch(userId, query, limit);
  }
}

/**
 * Fallback text search when vector search is unavailable
 */
async function fallbackTextSearch(
  userId: string,
  query: string,
  limit: number
): Promise<RAGDocument[]> {
  try {
    const { data, error } = await supabase
      .from('document_embeddings')
      .select('*')
      .eq('user_id', userId)
      .textSearch('content', query)
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Fallback search error:', error);
    return [];
  }
}

/**
 * Augment a chat message with context from similar documents
 */
export async function augmentWithContext(
  userId: string,
  message: string,
  contextLimit: number = 3
): Promise<string> {
  try {
    const similarDocs = await findSimilarDocuments(userId, message, contextLimit);

    if (similarDocs.length === 0) {
      return message;
    }

    const context = similarDocs
      .map((doc, index) => `[Context ${index + 1}]: ${doc.content}`)
      .join('\n\n');

    return `${context}\n\n---\n\nUser Question: ${message}`;
  } catch (error) {
    console.error('Error augmenting with context:', error);
    return message; // Return original message if augmentation fails
  }
}

/**
 * Delete all documents for a user
 */
export async function deleteUserDocuments(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('document_embeddings')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user documents:', error);
    throw new Error('Failed to delete documents');
  }
}

/**
 * Get document count for a user
 */
export async function getUserDocumentCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('document_embeddings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error getting document count:', error);
    return 0;
  }
}
