#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up the PFE Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher and try again."
    echo "🔗 https://nodejs.org/"
    exit 1
fi

# Check npm version
NPM_VERSION=$(npm -v | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 6 ]; then
    echo "❌ Your npm version is too old. Please update npm to version 6 or higher."
    echo "💡 Run: npm install -g npm@latest"
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongosh &> /dev/null; then
    echo "⚠️  MongoDB shell (mongosh) is not installed. The app will need MongoDB to run."
    echo "🔗 https://www.mongodb.com/try/download/community"
else
    if ! mongosh --eval "db.version()" > /dev/null 2>&1; then
        echo "⚠️  MongoDB is not running. Please start MongoDB before running the app."
    else
        echo "✅ MongoDB is running"
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment variables
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file from .env.example..."
    cp .env.example .env
    
    # Generate a random JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Update .env with the generated JWT secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your_jwt_secret_key_here/$JWT_SECRET/" .env
    else
        # Linux/Unix
        sed -i "s/your_jwt_secret_key_here/$JWT_SECRET/" .env
    fi
    
    echo "✅ .env file created with a random JWT secret"
else
    echo "✅ .env file already exists"
fi

echo "✨ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The API will be available at http://localhost:5001"
echo ""
