#!/bin/bash

echo "Setting up Veris..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "Error: Node.js 18 or higher is required"
  exit 1
fi

# Check pnpm
if ! command -v pnpm &> /dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm
fi

# Check uv
if ! command -v uv &> /dev/null; then
  echo "Warning: uv is not installed. Install it from https://docs.astral.sh/uv/getting-started/installation/"
  echo "This is required for the MCP database server."
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Create data directory
mkdir -p data
mkdir -p logs

# Copy env file if not exists
if [ ! -f services/crawler-service/.env ]; then
  cp services/crawler-service/.env.example services/crawler-service/.env
  echo "Created .env file. Please edit it with your API keys."
fi

echo "Setup complete! Run 'pnpm dev' to start the service."
