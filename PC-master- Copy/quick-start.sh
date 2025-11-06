#!/bin/bash
# Quick Start Script for PerformanceCore
# This script sets up and runs the application locally with in-memory storage

set -e  # Exit on any error

echo "🚀 PerformanceCore - Quick Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (this may take 1-2 minutes)..."
    npm install
    echo "✓ Dependencies installed"
    echo ""
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment configuration..."
    cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
SESSION_SECRET=dev-secret-change-in-production
EOF
    echo "✓ Environment configured"
    echo ""
fi

echo "================================"
echo "✅ Setup complete!"
echo ""
echo "🌐 Starting server on http://localhost:5000"
echo "   Press Ctrl+C to stop"
echo "================================"
echo ""

# Start the development server
npm run dev
