# Vancouver Drinking Fountains Finder 💧

A web application to help people find drinking fountains and bottle filling stations across Vancouver, promoting hydration and reducing plastic waste.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm v8+

### Installation

1. **Install Express dependencies:**
   ```bash
   cd express
   npm install
   node seed.js
   ```

2. **Install React dependencies:**
   ```bash
   cd ../react
   npm install
   ```

### Running the Application

**Development Mode:**
```bash
# Terminal 1 - Start API
cd express
npm start

# Terminal 2 - Start React Dev Server
cd react
npm start
```

Visit: http://localhost:1234

**Production Mode:**
```bash
# Build React app
cd react
npm run build

# Start Express server (serves both API and React)
cd ../express
npm start
```

Visit: http://localhost:3000

## 📋 Features

- 🔍 Search fountains by name or location
- 🏞️ Filter by park status, working condition, and type
- 📍 View detailed fountain information
- 📝 Report issues with fountains
- ⚡ Quick status updates
- 🗺️ List and map views
- 📱 Responsive design

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- File-based JSON storage
- RESTful API with validation

**Frontend:**
- React 18
- Parcel bundler
- CSS (no external UI libraries)

## 📊 Project Status

**Current: 75% Complete** ✅

Ready for oral exam and code review!

**See `documentation.md` for complete project details.**

---

**Course:** WMDD 4936 Term Project  
**Dataset:** Vancouver Open Data - Drinking Fountains  
**Date:** October 30, 2025
