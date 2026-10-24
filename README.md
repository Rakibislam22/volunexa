# 🌍 Volunexa — Community Event & Volunteer Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black?logo=socket.io)](https://socket.io/)

A modern, full-stack community event and volunteer coordination platform built to empower local organizations and volunteers. Featuring **real-time capacity synchronization**, **role-based security**, and **Gemini AI event generation**.

**Theme Design**: Built to match the sleek event discovery hero aesthetic with primary brand color **`#00494B`** (Deep Emerald Teal) and vibrant accent **`#FF4B72`**.

---

## 🚀 Live Demo Credentials

Use these credentials to test both perspectives of the platform:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Organizer** | `organizer@volunexa.com` | `password123` | Create/edit/delete events, manage volunteer rosters, view analytics |
| **Volunteer** | `volunteer@volunexa.com` | `password123` | Browse events, live registration, QR check-in pass, cancel participation |

*(You can also use the one-click **"Test with Demo Credentials"** buttons on the login page!)*

---

## ✨ Key Features

### 1. ⚡ Real-Time Synchronization (Socket.IO)
- **Live Volunteer Slot Counter**: Whenever a volunteer registers or cancels, all connected users see the remaining slot count update live on event cards and detail pages without refreshing.
- **Organizer Registration Alerts**: Organizers receive instant notifications whenever a new volunteer signs up for one of their events.
- **Volunteer Status Notifications**: Volunteers receive real-time notifications when an organizer confirms, attends, or updates their participation status.

### 2. 🛡️ Role-Based Access Control (RBAC) & Route Protection
- Two distinct roles: **Organizer** and **Volunteer**.
- **Route Guards**: Volunteers cannot access organizer dashboards, create events, or modify rosters.
- **Integrity Rules**: Organizers cannot register as volunteers for events; users cannot view or manipulate other users' private registration details.

### 3. 🤖 AI Event Description Assistant (Smart Element)
- Powered by **Google Gemini API** (with automated high-accuracy mock fallback).
- Organizers enter a brief event concept (e.g. *"Community tree plantation in Ramna Park"*).
- The AI automatically drafts:
  - Engaging 2-3 paragraph event description
  - Recommended volunteer roles and responsibilities
  - Essential skills required
  - Social media promotional pitch
  - Suggested category classification
- Organizers can review and edit all AI-generated content before publishing.

### 4. 📊 Data Analytics & Visualizations (Recharts)
- **Events by Category**: Breakdown of initiatives across Environment, Health, Education, Technology, etc.
- **Volunteer Registration Utilization**: Live capacity vs. actual registered count per event.
- **Volunteer Participation Breakdown**: Donut chart tracking Registered vs. Confirmed vs. Attended vs. Cancelled.

### 5. 🎁 Bonus Features Included
1. **Event Favorites**: Volunteers can bookmark events with instant real-time toggle.
2. **Registration Check-in QR Code**: Digital SVG QR code pass for registered volunteers for smooth on-site check-in.
3. **Event Sharing**: One-click link copying and social sharing (Twitter, WhatsApp, LinkedIn).
4. **Volunteer Profile**: Dedicated profile page managing bio, skills, and cause interests.
5. **Responsive Dark / Light Mode**: System-aware theme toggle with persistent state.

---

## 🛠️ Tech Stack & Architecture

### Frontend (`volunexa`)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Custom theme: `#00494B`, `#FF4B72`)
- **Visuals & Charts**: Recharts & Lucide React
- **QR Codes**: `qrcode.react`
- **Real-time Client**: `socket.io-client`

### Backend (`volunexa-server`)
- **Framework**: Express 5 on Node.js
- **Database**: MongoDB Atlas with Mongoose schemas & virtuals
- **Real-time Engine**: Socket.IO WebSockets with dedicated event and user rooms
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **AI Integration**: Google Generative AI (Gemini Flash)

---

## ⚙️ Environment Variables

### Backend (`volunexa-server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.yvchs0g.mongodb.net/volunexaDB?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (`volunexa/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 💻 Local Setup & Running Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Rakibislam22/volunexa.git
cd volunexa-all
```

### 2. Start the Backend Server
```bash
cd volunexa-server
npm install
npm run seed     # Seeds demo users, events, and initial registrations
npm run dev      # Runs Express + Socket.IO on port 5000
```

### 3. Start the Next.js Frontend
```bash
cd ../volunexa
npm install
npm run dev      # Runs Next.js App on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment Instructions

- **Frontend**: Deploy `volunexa` on **Vercel** or **Netlify**. Set environment variables `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` to your production backend URL.
- **Backend**: Deploy `volunexa-server` on **Render**, **Railway**, or **Fly.io** (with persistent WebSocket support enabled). Add MongoDB Atlas network whitelist IP `0.0.0.0/0`.
