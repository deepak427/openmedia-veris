# PowerShell setup script for Windows
Write-Host "Setting up Veris..." -ForegroundColor Cyan

# Check Node.js version
$nodeVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$nodeVersion -lt 18) {
    Write-Host "Error: Node.js 18 or higher is required" -ForegroundColor Red
    exit 1
}

# Check pnpm
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Check uv
if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "Warning: uv is not installed." -ForegroundColor Yellow
    Write-Host "Install it from https://docs.astral.sh/uv/getting-started/installation/" -ForegroundColor Yellow
    Write-Host "This is required for the MCP database server." -ForegroundColor Yellow
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
pnpm install

# Create directories
New-Item -ItemType Directory -Force -Path "data" | Out-Null
New-Item -ItemType Directory -Force -Path "logs" | Out-Null

# Copy env file if not exists
if (-not (Test-Path "services/crawler-service/.env")) {
    Copy-Item "services/crawler-service/.env.example" "services/crawler-service/.env"
    Write-Host "Created .env file. Please edit it with your API keys." -ForegroundColor Green
}

Write-Host "Setup complete! Run 'pnpm dev' to start the service." -ForegroundColor Green
