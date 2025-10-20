#!/bin/bash

# Pilot Server - Easy Deploy Script
# This script helps you deploy Pilot Server quickly

set -e  # Exit on error

echo "🚀 Pilot Server - Easy Deploy Setup"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the Pilot-Server root directory."
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Step 2: Setting up environment..."
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo ""
    echo "📋 Note: The app will run in localStorage mode by default."
    echo "   To enable database features, edit .env and add your Supabase credentials."
    echo ""
else
    echo "📝 Step 2: Environment file exists"
    echo "✅ .env file already exists"
    echo ""
fi

echo "🏗️  Step 3: Building application..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""

echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "You can now:"
echo ""
echo "  1. Start development server:"
echo "     npm run dev"
echo ""
echo "  2. Preview production build:"
echo "     npm run preview"
echo ""
echo "  3. Deploy to GitHub Pages:"
echo "     git push origin main"
echo "     (if GitHub Actions is configured)"
echo ""
echo "  4. Access locally at:"
echo "     http://localhost:4173 (development)"
echo ""
echo "📖 For more deployment options, see:"
echo "   - docs/PLUG_AND_PLAY.md (comprehensive guide)"
echo "   - docs/QUICK_START.md (10-minute setup)"
echo ""
echo "💡 Current mode: localStorage (no configuration needed)"
echo "   To enable database features, see docs/SUPABASE_SETUP.md"
echo ""
