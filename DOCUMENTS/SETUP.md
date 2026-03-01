# Setup & Installation Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [API Keys & Third-Party Services](#api-keys--third-party-services)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v16.0.0 or higher)
  - [Download Node.js](https://nodejs.org/)
  - Verify installation: `node --version`
  
- **npm** (v7.0.0 or higher) or **pnpm** (v6.0.0 or higher)
  - npm comes with Node.js
  - Or install pnpm: `npm install -g pnpm`
  
- **Git**
  - [Download Git](https://git-scm.com/)
  - Verify installation: `git --version`

### Optional but Recommended
- **MongoDB** (local or Atlas cloud)
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)
- **MongoDB Compass** - MongoDB GUI tool
- **Postman** - API testing tool

### System Requirements
- **RAM**: Minimum 2GB, recommended 4GB+
- **Storage**: At least 500MB free space
- **Internet**: Required for API integrations and npm packages

---

## 🏠 Local Development Setup

### Step 1: Clone the Repository

```bash
# Clone using HTTPS
git clone https://github.com/yourusername/ai-marketing-loop.git

# Or clone using SSH (if SSH key configured)
git clone git@github.com:yourusername/ai-marketing-loop.git

# Navigate to the project directory
cd ai-marketing-loop
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using pnpm (faster):
```bash
pnpm install
```

This will install all dependencies listed in `package.json`.

### Step 3: Verify Installation

```bash
# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0
```

### Step 4: Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

---

## ⚙️ Environment Configuration

### Creating Environment Files

1. **Create `.env.local` in the project root**:

```bash
# Root directory .env.local
touch .env.local
```

2. **Create `.env` in the server directory**:

```bash
cd server
touch .env
cd ..
```

### Frontend Configuration (`.env.local`)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# Application Settings
VITE_APP_NAME=AI Marketing Loop
VITE_APP_VERSION=1.0.0

# Authentication
VITE_AUTH_ENABLED=true
VITE_SESSION_TIMEOUT=3600000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_COMPETITOR_INTEL=true
VITE_ENABLE_STRATEGY_MODULE=true

# AI Services
VITE_ANTHROPIC_API_KEY=your_api_key_here

# Google Integration
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_client_secret_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# Optional: Analytics
VITE_ANALYTICS_ID=

# Optional: Sentry (Error tracking)
VITE_SENTRY_DSN=
```

### Backend Configuration (`server/.env`)

```env
# Server Configuration
PORT=3000
NODE_ENV=development
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/ai-marketing-loop
MONGODB_OPTIONS_POOLSIZE=10

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# AI Services
ANTHROPIC_API_KEY=your_api_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=debug
LOG_FILE=./logs/app.log

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Important Notes
- **Never commit `.env` files to version control**
- Use `.env.example` as a template
- Each developer should have their own `.env.local` file
- For production, use secure environment variable management

---

## 🗄️ Database Setup

### Option 1: MongoDB Local Installation

#### macOS (using Homebrew)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify installation
mongo --version
```

#### Linux (Ubuntu/Debian)
```bash
# Install dependencies
sudo apt-get install -y gnupg wget

# Add MongoDB key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

#### Windows
```bash
# Download MongoDB Community from
# https://www.mongodb.com/try/download/community

# Run the installer and follow the installation wizard
# MongoDB will install as a Windows Service
```

### Option 2: MongoDB Atlas (Cloud) - Recommended

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user with strong password
5. Whitelist your IP address
6. Get the connection string
7. Add to `.env` as `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### Initialize Database

```bash
# Connect to MongoDB
mongosh

# Create database (automatic on first insert)
use ai-marketing-loop

# Create necessary indexes (if needed)
db.users.createIndex({ email: 1 }, { unique: true })
db.campaigns.createIndex({ userId: 1, createdAt: -1 })

# Exit
exit
```

### Verify Database Connection

```bash
# Test connection from Node.js
node -e "require('mongodb').MongoClient.connect(process.env.MONGODB_URI).then(client => { console.log('Connected!'); client.close(); }).catch(err => console.error(err))"
```

---

## 🔑 API Keys & Third-Party Services

### Anthropic Claude API

1. Visit [Anthropic Console](https://console.anthropic.com)
2. Sign up for an account
3. Create an API key
4. Add to `.env.local`:
   ```env
   VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```

### Google OAuth Integration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 Credentials (Web Application)
5. Set authorized redirect URIs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
6. Copy Client ID and Secret to `.env.local`

### Google Analytics API (Optional)

1. Enable Google Analytics API in Google Cloud Console
2. Create Service Account credentials (JSON key)
3. Store the JSON file securely
4. Add to environment variables if needed

---

## 🚀 Running the Application

### Development Mode (Frontend + Backend)

#### Terminal 1 - Backend Server
```bash
cd server
npm start
# Or for hot reload during development:
npm run dev

# Server runs at http://localhost:3000
```

#### Terminal 2 - Frontend Development Server
```bash
npm run dev

# Frontend runs at http://localhost:5173
```

### Production Build

```bash
# Build the frontend
npm run build

# This creates an optimized build in the `dist/` directory
# Build output can be deployed to any static hosting service
```

### Preview Production Build

```bash
# Build for production
npm run build

# Preview the built application
npm run preview

# Visit http://localhost:4173 to test
```

### Running Tests

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npx vitest --coverage
```

### Code Quality Checks

```bash
# Run ESLint
npm run lint

# Format code (if prettier installed)
npx prettier --write src/
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue: "Cannot find module" errors after installation

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Port 3000 or 5173 already in use

**Solution:**
```bash
# On macOS/Linux - find and kill process using port
lsof -ti:3000 | xargs kill -9

# On Windows - find and end task
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or specify different port
PORT=3001 npm run dev
```

#### Issue: MongoDB connection failed

**Checklist:**
- Verify MongoDB is running: `systemctl status mongod` (Linux) or MongoDB Compass
- Check connection string in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure credentials are correct
- Check firewall settings

```bash
# Test connection manually
mongosh "mongodb://localhost:27017"
```

#### Issue: API keys not working

**Solution:**
- Verify keys are in `.env.local` (frontend) or `server/.env` (backend)
- Restart the development server after changing `.env`
- Check key expiration dates
- Verify API service is active and not rate-limited

#### Issue: Vite dev server not starting

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
npm install

# Start fresh
npm run dev
```

#### Issue: TypeScript errors

**Solution:**
```bash
# Rebuild TypeScript
npx tsc --build --clean
npx tsc --build

# Or restart the dev server
# VS Code: Ctrl+Shift+P > TypeScript: Restart TS Server
```

#### Issue: Dependencies conflict

**Solution:**
```bash
# Use npm audit to check
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies safely
npm update
```

---

## 📦 Production Deployment

### Frontend Deployment (Vercel, Netlify, AWS S3)

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel deploy --prod

# Environment variables set in Vercel dashboard
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option 3: AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Backend Deployment

#### Option 1: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

#### Option 2: AWS EC2

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18

# Clone and setup
git clone your-repo
cd ai-marketing-loop
npm install

# Use PM2 for process management
npm install -g pm2
pm2 start server/server.js
pm2 startup
pm2 save
```

#### Option 3: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Frontend build
COPY package.json pnpm-lock.yaml ./
RUN npm install
RUN npm run build

# Backend
COPY server/package.json server/
WORKDIR /app/server
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t ai-marketing-loop .
docker run -p 3000:3000 --env-file .env ai-marketing-loop
```

### Environment Variables for Production

```env
# Production - Frontend (.env.production)
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_TIMEOUT=30000
VITE_AUTH_ENABLED=true

# Production - Backend (server/.env.production)
PORT=3000
NODE_ENV=production
MONGODB_URI=your_production_mongodb_atlas_uri
JWT_SECRET=strong_random_secret_key
ANTHROPIC_API_KEY=your_api_key
```

### SSL/HTTPS Certificate

For production:
```bash
# If using Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

### Monitoring & Maintenance

```bash
# Monitor server
pm2 logs
pm2 status

# View error logs
tail -f /var/log/app.log

# Regular backups
mongodump --uri="mongodb://..." --out /backups/
```

---

## ✨ Post-Installation Checklist

- [ ] Node.js and npm installed and verified
- [ ] Repository cloned successfully
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created with required variables
- [ ] MongoDB configured and accessible
- [ ] API keys obtained and added to `.env`
- [ ] Backend server starts without errors
- [ ] Frontend development server starts
- [ ] Application loads in browser
- [ ] Can log in/authenticate
- [ ] Basic features tested

---

## 📚 Additional Resources

- [Node.js Official Guide](https://nodejs.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: March 2026
