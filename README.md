# IntellMeet – AI-Powered Video Meeting Platform

IntellMeet is a full-stack MERN-based video meeting platform designed to simplify online collaboration. The application provides secure authentication, meeting management, real-time communication infrastructure, and AI-ready meeting capabilities through a clean and responsive user interface.

---

## 🚀 Features

### Authentication
- User Registration
- Secure Login
- JWT Authentication
- Protected Routes

### Meeting Management
- Create Meetings
- Join Meetings using Meeting Code
- Meeting Lobby
- Meeting Details
- Dashboard
- Leave Meeting

### Real-Time Communication
- Socket.IO Integration
- WebRTC Infrastructure
- Camera Initialization
- Microphone Initialization
- Meeting Lifecycle Management

### User Experience
- Responsive Dashboard
- Profile Management
- Modern UI using Tailwind CSS
- Toast Notifications
- Loading States
- Form Validation

### AI Ready
- AI Module Architecture
- Meeting Summary Support
- Action Item Framework
- Provider-based AI Service Structure

---

# Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Zustand
- React Query
- Axios
- Socket.IO Client
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- Cloudinary
- Multer

---

# Project Structure

```text
IntellMeet/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── lib/
│   │   └── utils/
│   │
│   └── public/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   └── utils/
│   │
│   └── server.js
│
├── CONTEXT.md
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/IntellMeet.git
cd IntellMeet
```

---

## Install Dependencies

### Root

```bash
npm install
```

### Client

```bash
cd client
npm install
```

### Server

```bash
cd ../server
npm install
```

---

# Environment Variables

### Server (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api

VITE_SOCKET_URL=http://localhost:5000
```

---

# Running the Project

## Backend

```bash
cd server

npm run dev
```

---

## Frontend

```bash
cd client

npm run dev
```

---

# Build

```bash
npm run build --prefix client
```

---

# Lint

```bash
npm run lint
```

---

# Core Workflow

```
Signup
        ↓
Login
        ↓
Dashboard
        ↓
Create Meeting
        ↓
Meeting Lobby
        ↓
Join Meeting
        ↓
Meeting Room
        ↓
Leave Meeting
        ↓
Dashboard
```

---

# Technologies Used

| Category | Technology |
|-----------|------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT |
| State Management | Zustand |
| Server State | React Query |
| Real-Time | Socket.IO |
| Video Infrastructure | WebRTC |
| Image Storage | Cloudinary |

---

# Future Enhancements

- AI Meeting Summaries
- Action Item Generation
- Meeting Recording
- Screen Sharing Improvements
- Live Chat Enhancements
- Calendar Integration
- Email Invitations
- Notification System

---

# Author

**Aazim Khursheed**

B.Tech Computer Science & Engineering

GitHub: https://github.com/Aazimkhursheed

LinkedIn: https://linkedin.com/in/aazim-khursheed-203304294

---

# License

This project is developed for educational and learning purposes.
