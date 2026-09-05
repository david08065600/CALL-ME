# CALL ME - AI Video Calling & Real-Time Face Effects

**"Connect. Transform. Call."**

A production-ready web application for secure peer-to-peer video calling with real-time AI face effects powered by MediaPipe and WebRTC.

## Features

- 🎥 **Real-time Video Calling** - Peer-to-peer WebRTC video calls
- 🎭 **AI Face Effects** - Local browser-based real-time face visual effects using MediaPipe
- 🤖 **AI Assistant** - Integrated OpenAI assistant for help and guidance
- 💳 **Credit System** - Built-in credit management for usage tracking
- 🔒 **Secure Authentication** - JWT-based auth with password hashing
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Theme** - Modern, minimal, premium interface
- 🛡️ **Privacy-Focused** - Face processing happens locally in the browser
- ⚙️ **Settings & Profiles** - Comprehensive user settings and profile management

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- WebRTC
- MediaPipe Tasks Vision
- React Router

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- WebSocket (ws)
- JWT Authentication

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+

### Installation

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Update .env with your values
# DATABASE_URL, SESSION_SECRET, OPENAI_API_KEY (optional), etc.
```

### Database Setup

The application will automatically initialize the database schema on first run.

### Development

```bash
# Start both frontend and backend with hot reload
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
CALL-ME/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API and WebRTC services
│   │   ├── lib/           # Utilities (MediaPipe, face effects)
│   │   ├── types/         # TypeScript types
│   │   ├── styles/        # Global styles
│   │   └── App.tsx        # Main app component
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   ├── websocket/     # WebSocket handlers
│   │   ├── db/            # Database setup
│   │   ├── utils/         # Utilities
│   │   ├── types/         # TypeScript types
│   │   └── server.ts      # Entry point
│   └── package.json
│
├── .env.example           # Environment template
├── package.json           # Root configuration
└── README.md
```

## Browser Support

- ✅ Chrome/Chromium 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14.1+

---

**Connect. Transform. Call.** 🚀
