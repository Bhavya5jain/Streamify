# 🎬 Streamify

> A full-stack **video streaming platform** with creator tools, built using **React + TypeScript** on the frontend and **Node.js + Express + MongoDB** on the backend. Designed around real-world system design principles — JWT auth, Cloudinary media storage, Redis caching, aggregation pipelines, and a full RESTful API.

---

## 📌 Table of Contents

- [Overview](#-overview) 
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Database Models](#-database-models)
- [API Endpoints](#-api-endpoints)
- [Frontend Pages](#-frontend-pages)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Author](#-author)

---

## 🌟 Overview

Streamify is a full-stack video streaming platform built from scratch with a **strong emphasis on production-grade backend architecture**, RESTful API design, and scalable system design patterns. It supports the complete lifecycle of a video platform — from user onboarding and media uploads to creator analytics and community engagement.

Key highlights:
- **JWT-based authentication** with Access & Refresh Tokens
- **Cloudinary** for video and image storage
- **Redis** for caching
- **MongoDB Aggregation Pipelines** for complex queries (watch history, channel stats, etc.)
- **Multer** for multipart file uploads
- **OTP-based email verification** via Nodemailer
- **Paginated video feeds** using `mongoose-aggregate-paginate-v2`

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Access & Refresh token auth |
| Bcrypt | Password hashing |
| Cloudinary | Video & image cloud storage |
| Multer | File upload handling |
| Redis | Caching layer |
| Nodemailer | Email (OTP) sending |
| Nodemon | Dev auto-restart |
| Prettier | Code formatting |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| React Router DOM v6 | Client-side routing |
| Lucide React | Icon library |
| Recharts | Analytics charts |
| Vanilla CSS | Styling |

---

## 📁 Project Structure

```
Streamify/
├── Backend/
│   ├── src/
│   │   ├── controllers/       # Business logic for each feature
│   │   │   ├── user.controller.js
│   │   │   ├── video.controller.js
│   │   │   ├── comment.controller.js
│   │   │   ├── like.controller.js
│   │   │   ├── playlist.controller.js
│   │   │   ├── subscription.controller.js
│   │   │   ├── tweet.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── video.model.js
│   │   │   ├── comment.model.js
│   │   │   ├── like.model.js
│   │   │   ├── playlist.model.js
│   │   │   ├── subscriptions.model.js
│   │   │   └── tweet.model.js
│   │   ├── routes/            # Express routers
│   │   │   ├── user.routes.js
│   │   │   ├── video.routes.js
│   │   │   ├── comment.routes.js
│   │   │   ├── like.routes.js
│   │   │   ├── playlist.routes.js
│   │   │   ├── subscription.routes.js
│   │   │   ├── tweet.routes.js
│   │   │   └── dashboard.routes.js
│   │   ├── middlewares/       # Custom Express middlewares
│   │   │   ├── Auth.middleware.js       # JWT verification
│   │   │   ├── multer.middleware.js     # File upload config
│   │   │   ├── generateOTP.middleware.js
│   │   │   ├── verifyOTP.middleware.js
│   │   │   └── mailer.middleware.js     # Email sending
│   │   ├── utils/             # Helper utilities
│   │   │   ├── apiError.js             # Custom error class
│   │   │   ├── apiResponse.js          # Standardized response
│   │   │   ├── asyncHandler.js         # Async error wrapper
│   │   │   ├── cloudinary.js           # Cloudinary upload/delete
│   │   │   └── redisClient.js          # Redis connection
│   │   ├── db/
│   │   │   └── db.js                   # MongoDB connection
│   │   ├── app.js             # Express app setup, CORS, routes
│   │   └── index.js           # Server entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable UI components
    │   │   ├── Navbar.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── MobileNav.tsx
    │   │   ├── VideoCard.tsx
    │   │   └── TweetCard.tsx
    │   ├── pages/             # Route-level page components
    │   │   ├── HomePage.tsx
    │   │   ├── WatchPage.tsx
    │   │   ├── UploadPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── AnalyticsPage.tsx
    │   │   ├── AdminPage.tsx
    │   │   ├── PlaylistsPage.tsx
    │   │   ├── LikedVideosPage.tsx
    │   │   ├── WatchLaterPage.tsx
    │   │   ├── SubscriptionsPage.tsx
    │   │   ├── TrendingPage.tsx
    │   │   ├── ExplorePage.tsx
    │   │   ├── HistoryPage.tsx
    │   │   ├── NotificationsPage.tsx
    │   │   ├── SettingsPage.tsx
    │   │   ├── HelpPage.tsx
    │   │   ├── LoginPage.tsx
    │   │   └── RegisterPage.tsx
    │   ├── App.tsx             # Root component & routing
    │   └── main.tsx            # React entry point
    ├── index.html
    ├── vite.config.ts
    └── package.json
```

---

## ✨ Features

### 🔐 Authentication & User Management
- User **registration** with avatar & cover image upload
- User **login / logout** with JWT (Access Token + Refresh Token)
- **Token refresh** endpoint
- **Change password** (old password verification)
- **Update profile** — name, email, avatar, cover image
- Get **current user**, **channel profile** (by username), and **watch history**

### 🎥 Video Management
- **Upload videos** with thumbnail (stored on Cloudinary)
- **Get all videos** — paginated, filterable, searchable
- **Get single video** by ID (automatically increments view count)
- **Update video** — title, description, thumbnail
- **Delete video** (removes from Cloudinary too)
- **Toggle publish/unpublish** status

### 💬 Comments
- Add, edit, delete comments on videos
- Get all comments for a video (paginated)

### 👍 Likes
- Like / unlike **videos**
- Like / unlike **comments**
- Like / unlike **tweets**
- Get all **liked videos** for a user

### 📋 Playlists
- Create, update, delete playlists
- Add / remove videos from a playlist
- Get a specific playlist, or all playlists for a user

### 🔔 Subscriptions
- Subscribe / unsubscribe to channels
- Get list of **subscribers** for a channel
- Get list of channels a user is **subscribed to**

### 🐦 Tweets (Community Posts)
- Create, update, delete short posts (tweets)
- Get all tweets by a user

### 📊 Dashboard & Analytics
- Channel stats — total views, subscribers, videos, likes
- All uploaded videos with detailed info

---

## 🗄 Database Models

### User
| Field | Type | Details |
|---|---|---|
| `username` | String | Unique, lowercase, indexed |
| `email` | String | Unique, lowercase |
| `fullName` | String | Indexed |
| `avtar` | String | Cloudinary URL |
| `coverImage` | String | Cloudinary URL |
| `password` | String | Bcrypt hashed |
| `refreshToken` | String | JWT refresh token |
| `watchHistory` | ObjectId[] | Ref → Video |

### Video
| Field | Type | Details |
|---|---|---|
| `videoFile` | String | Cloudinary URL |
| `thumbnail` | String | Cloudinary URL |
| `owner` | ObjectId | Ref → User |
| `title` | String | — |
| `description` | String | — |
| `duration` | Number | In seconds |
| `views` | Number | Default: 0 |
| `isPublished` | Boolean | Default: true |

### Other Models
- **Comment** — body, video ref, owner ref
- **Like** — video / comment / tweet ref, liked-by ref
- **Playlist** — name, description, videos[], owner ref
- **Subscription** — subscriber ref, channel ref
- **Tweet** — content, owner ref

---

## 📡 API Endpoints

### Users — `/users`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user (avatar + coverImage) |
| POST | `/login` | ❌ | Login, returns tokens |
| POST | `/logout` | ✅ | Logout |
| POST | `/refreshAccessToken` | ✅ | Refresh access token |
| POST | `/changeCurrentPassword` | ✅ | Change password |
| PATCH | `/updateAccountDetails` | ✅ | Update name/email |
| PATCH | `/updateUserAvatar` | ✅ | Update avatar |
| PATCH | `/updateUsercoverImage` | ✅ | Update cover image |
| GET | `/getCurrentUser` | ✅ | Get logged-in user |
| GET | `/getUserChannelProfile/c/:username` | ✅ | Get channel profile |
| GET | `/getWatchHistory` | ✅ | Get watch history |

### Videos — `/videos`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get all videos (paginated) |
| POST | `/` | ✅ | Upload a new video |
| GET | `/:videoId` | ✅ | Get video by ID |
| PUT | `/:videoId` | ✅ | Update video details |
| DELETE | `/:videoId` | ✅ | Delete video |
| POST | `/:videoId/toggle-publish` | ✅ | Toggle publish status |

### Comments — `/comments`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/:videoId` | ✅ | Get comments for video |
| POST | `/:videoId` | ✅ | Add comment |
| PATCH | `/c/:commentId` | ✅ | Update comment |
| DELETE | `/c/:commentId` | ✅ | Delete comment |

### Likes — `/likes`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/toggle/v/:videoId` | ✅ | Like/unlike video |
| POST | `/toggle/c/:commentId` | ✅ | Like/unlike comment |
| POST | `/toggle/t/:tweetId` | ✅ | Like/unlike tweet |
| GET | `/videos` | ✅ | Get all liked videos |

### Playlists — `/playlists`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create playlist |
| GET | `/:playlistId` | ✅ | Get playlist by ID |
| PATCH | `/:playlistId` | ✅ | Update playlist |
| DELETE | `/:playlistId` | ✅ | Delete playlist |
| PATCH | `/add/:videoId/:playlistId` | ✅ | Add video to playlist |
| PATCH | `/remove/:videoId/:playlistId` | ✅ | Remove video from playlist |
| GET | `/user/:userId` | ✅ | Get user's playlists |

### Subscriptions — `/subscriptions`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/c/:channelId` | ✅ | Toggle subscribe |
| GET | `/c/:channelId` | ✅ | Get channel subscribers |
| GET | `/u/:subscriberId` | ✅ | Get subscribed channels |

### Tweets — `/tweets`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create tweet |
| GET | `/user/:userId` | ✅ | Get user's tweets |
| PATCH | `/:tweetId` | ✅ | Update tweet |
| DELETE | `/:tweetId` | ✅ | Delete tweet |

### Dashboard — `/dashboard`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/stats` | ✅ | Channel stats |
| GET | `/videos` | ✅ | All channel videos |

---

## 🖥 Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Video feed |
| `/watch/:id` | Watch | Video player + comments |
| `/upload` | Upload | Upload new video |
| `/profile` | Profile | User profile & channel |
| `/dashboard` | Dashboard | Creator dashboard |
| `/analytics` | Analytics | Charts & stats |
| `/admin` | Admin | Admin panel |
| `/playlists` | Playlists | Manage playlists |
| `/liked` | Liked Videos | All liked videos |
| `/saved` | Watch Later | Saved videos |
| `/subscriptions` | Subscriptions | Subscribed channels |
| `/trending` | Trending | Trending videos |
| `/explore` | Explore | Browse/search videos |
| `/history` | History | Watch history |
| `/notifications` | Notifications | Alerts & updates |
| `/settings` | Settings | Account settings |
| `/help` | Help | Help & support |
| `/login` | Login | Login page |
| `/register` | Register | Registration page |

---

## 🔧 Environment Variables

Create a `.env` file inside the `Backend/` folder with the following keys:

```env
# Server
PORT=8000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>

# CORS
CORS_ORIGIN=*

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ **Never commit your `.env` file to version control.**

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Redis (optional, for caching)

### 1. Clone the Repository

```bash
git clone https://github.com/Bhavya5jain/Streamify.git
cd Streamify
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file as shown above, then:

```bash
npm run dev
```

The backend server will start at `http://localhost:8000`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will start at `http://localhost:5173`

---

## 👤 Author

**Bhavya Jain**

- GitHub: [@Bhavya5jain](https://github.com/Bhavya5jain)

---

> ⭐ If you found this project helpful or interesting, consider giving it a star!
