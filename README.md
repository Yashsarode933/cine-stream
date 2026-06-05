# CineStream — Netflix Clone Pro
### Full-Stack Developer Blueprint (TMDB API + React + Express + MongoDB)

CineStream is a production-grade full-stack Netflix clone discovery platform built with **React 18, Vite, Tailwind CSS, Framer Motion, Zustand, and TanStack React Query** on the frontend, and a **Node.js, Express, and MongoDB** backend server. It serves as an advanced portfolio project showing solid competence in full-stack architecture, secure API proxying, JWT session controls, and interactions.

---

## 🚀 Key Features

*   **Interactive Cinema UI**: Hero billboard with 8-second auto-rotation, weekly trending posters, and play/info commands.
*   **Netflix Hover Expansion**: Custom `MovieCard` transitions scaling `1.1x` (with Framer Motion springs and sibling scale shifts) loading trailer embeds automatically after a 500ms hover delay.
*   **Seamless Detail Modal**: Zoom transitions, YouTube player overlays (mute/unmute toggles), cast profile circles, and similar title recommendations.
*   **Real-time Debounced Search**: A 300ms debounce buffer optimization querying movies/TV shows/people with type-filtering chips and `localStorage` search history tracking.
*   **Robust Watchlist & Progress History**: Persists watchlists and tracks playback progress bars on cards from MongoDB collections.
*   **3-Step Register Form**: Validation using `react-hook-form` + `zod` schemas.
*   **Secure API Proxy Pattern**: Keeps TMDB credentials private on the server with a customizable caching middleware layer (30 mins for feeds, 1 hour for details).
*   **Fail-safe Mock Mode**: Auto-falls back to a static movie dataset if `TMDB_API_KEY` is not configured, making it run instantly out of the box!

---

## 🛠️ Tech Stack & Directory Mapping

```
cine-stream/
├── package.json (root workspace)
├── backend/            (Express Node API)
│   ├── config/         (DB connection & Mock Data fallbacks)
│   ├── models/         (User, Watchlist, WatchHistory, Rating schemas)
│   ├── middleware/     (JWT verification, rate limiters, caching layers)
│   ├── controllers/    (Auth, User Actions, TMDB proxy logic)
│   └── routes/         (Auth, User, TMDB routers)
└── frontend/           (React SPA Vite client)
    ├── src/
    │   ├── api/        (Axios instances with interceptors)
    │   ├── components/ (Navbar, Hero, ContentRows, Cards, LoadingSkeletons)
    │   ├── hooks/      (TanStack server-state queries & mutations)
    │   ├── store/      (Zustand Auth and UI stores)
    │   └── pages/      (Landing, Login, Signup, Home, Search, Genre, History)
```

---

## ⚙️ Environment Configurations

Create a `.env` file in the `backend/` and `frontend/` folders respectively:

### Backend: `backend/.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/cinestream
JWT_SECRET=cinestream_super_secret_jwt_key_2026_dev
JWT_REFRESH_SECRET=cinestream_super_secret_refresh_jwt_key_2026_dev
TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
CLIENT_URL=http://localhost:5173
```
*(Leave `TMDB_API_KEY` empty or as the placeholder to enable local **Mock Mode**!)*

### Frontend: `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
# VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## 🏁 How to Run Locally

First, ensure you have **Node.js (v18+)** and a local **MongoDB** server running (if you want to test watchlist persistence).

1.  **Clone the workspace** and navigate to the project directory.
2.  **Install all dependencies** at once:
    ```bash
    npm install
    npm run install:all
    ```
3.  **Run Dev Servers** concurrently:
    ```bash
    npm run dev
    ```
    This launches:
    *   **Frontend**: `http://localhost:5173`
    *   **Backend**: `http://localhost:5000`

---

## 🔍 Code Walkthrough & Design Details

*   **Google OAuth Fallback**: If no Client ID is provided, clicking "Continue with Google" triggers a mock developer login profile to make review easy.
*   **Performance Optimization**: Images are lazy loaded (`loading="lazy"`) and trailer requests are postponed until 500ms hover thresholds are crossed.
*   **State Alignment**: Mongoose schemas enforce compound indices `{ userId: 1, tmdbId: 1 }` preventing redundant entries while improving search read times.

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/cine-stream.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "Add New Project" → Import your GitHub repository
   - Select the `frontend` folder as root directory
   - Configure build settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add environment variable:
     - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-backend.onrender.com/api`)
   - Click "Deploy"

3. **Update Backend CORS**
   - In `backend/server.js`, update the CORS origin to your Vercel URL:
   ```javascript
   cors({
     origin: ['http://localhost:5173', 'https://your-vercel-app.vercel.app'],
     credentials: true
   })
   ```

### Backend Deployment (Render)

1. **Prepare Backend**
   - Ensure `backend/.env` has all required variables
   - Add `MONGO_URI` from MongoDB Atlas (see below)

2. **Deploy to Render**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
   - Add environment variables in Render dashboard:
     - `PORT`: 5000
     - `NODE_ENV`: production
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Your JWT secret
     - `JWT_REFRESH_SECRET`: Your refresh token secret
     - `TMDB_API_KEY`: Your TMDB API key
     - `CLIENT_URL`: Your Vercel frontend URL
   - Click "Deploy Web Service"

### MongoDB Atlas Setup (Free Tier)

1. **Create Cluster**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Click "Build a Database" → Select "Free" (M0) tier
   - Choose a cloud region closest to you
   - Create cluster name (e.g., `cinestream`)

2. **Configure Database Access**
   - Create a database user with username and password
   - **Important**: Save these credentials for your MONGO_URI

3. **Network Access**
   - Add IP address `0.0.0.0/0` to allow access from anywhere (for Render deployment)

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/cinestream?retryWrites=true&w=majority`

### Environment Variables Summary

**Backend (.env):**
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cinestream
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
TMDB_API_KEY=your_tmdb_api_key_here
CLIENT_URL=https://your-vercel-app.vercel.app
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Post-Deployment Checklist

- [ ] Test frontend loads correctly on Vercel
- [ ] Test API endpoints from deployed backend
- [ ] Verify authentication flow (register, login, logout)
- [ ] Test TMDB data fetching
- [ ] Verify watchlist persistence
- [ ] Check all pages load without errors
- [ ] Test mobile responsiveness

### Troubleshooting

**CORS Errors:**
- Ensure backend CORS includes your Vercel URL
- Check that credentials are enabled in CORS config

**Database Connection Issues:**
- Verify IP whitelist in MongoDB Atlas includes `0.0.0.0/0`
- Check MONGO_URI format is correct
- Ensure database user has correct permissions

**Build Failures:**
- Check Render logs for specific error messages
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility (v18+ recommended)

---

## 📝 Project Structure

```
cine-stream/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── package.json
└── README.md
```
