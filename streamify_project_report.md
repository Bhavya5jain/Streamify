# 📋 Project Report — Streamify

> **Author:** Bhavya Jain &nbsp;|&nbsp; **GitHub:** [@Bhavya5jain](https://github.com/Bhavya5jain) &nbsp;|&nbsp; **Type:** Full-Stack Web Application

---

## 🔗 GitHub Repository

| | |
|---|---|
| **Repository** | [github.com/Bhavya5jain/Streamify](https://github.com/Bhavya5jain/Streamify) |
| **Author** | [Bhavya5jain](https://github.com/Bhavya5jain) |
| **Visibility** | Public |
| **Stack** | React + TypeScript · Node.js · MongoDB · Cloudinary · Redis |

---

## 1. 🌟 Project Overview

**Streamify** is a full-stack video streaming platform inspired by YouTube, built from the ground up with a strong emphasis on **production-grade backend architecture**, RESTful API design, and scalable system design patterns.

The project covers the **complete lifecycle of a video platform** — from user onboarding and media uploads to creator analytics, community engagement (tweets/comments), and an admin panel.

> **Goal:** Understand how large-scale video platforms like YouTube work behind the scenes — authentication, video pipelines, media management, and data handling.

---

## 2. 🛠 Tech Stack

### 🔵 Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI component framework |
| TypeScript | ~5.5.3 | Type-safe JavaScript |
| Vite | ^5.4.2 | Build tool & dev server |
| React Router DOM | ^6.25.1 | Client-side routing |
| Lucide React | ^0.400.0 | Icon library |
| Recharts | ^2.12.7 | Analytics & data charts |
| Vanilla CSS | — | Styling (no framework) |

### 🟢 Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | ^5.2.1 | REST API server |
| MongoDB + Mongoose | ^9.1.5 | Database & ODM |
| JWT (jsonwebtoken) | ^9.0.3 | Access & Refresh token auth |
| Bcrypt | ^6.0.0 | Password hashing |
| Cloudinary | ^2.9.0 | Video & image cloud storage |
| Multer | ^2.0.2 | Multipart file upload handling |
| Redis | ^5.11.0 | Caching layer |
| Nodemailer | ^8.0.4 | OTP-based email verification |
| Mongoose-aggregate-paginate | ^1.1.4 | Paginated aggregation queries |
| Nodemon | ^3.1.11 | Dev auto-restart |
| Prettier | ^3.8.1 | Code formatting |

---

## 3. 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                     │
│          React 18 + TypeScript + Vite                   │
│    [Navbar] [Sidebar] [Pages] [VideoCard] [Charts]      │
└─────────────────────┬───────────────────────────────────┘
                      │  HTTP / REST API
                      ▼
┌─────────────────────────────────────────────────────────┐
│               BACKEND (Node.js + Express)               │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │  Routes  │→ │Controllers│→ │   Business Logic      │ │
│  └──────────┘  └──────────┘  └───────────────────────┘ │
│                      │                                  │
│   ┌──────────────────┼───────────────────┐             │
│   ▼                  ▼                   ▼             │
│ [MongoDB]         [Redis]          [Cloudinary]        │
│ (Data Store)      (Cache)          (Media Storage)     │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions:
- **JWT dual-token strategy** — short-lived Access Token (1 day) + long-lived Refresh Token (10 days)
- **Cloudinary** for all media storage (no local file storage in production)
- **Redis** as a caching layer to reduce MongoDB load
- **MongoDB Aggregation Pipelines** for complex queries (channel stats, watch history, etc.)
- **Multer** for handling multipart file uploads before pushing to Cloudinary
- **OTP via Nodemailer** for email verification
- **Mongoose `mongoose-aggregate-paginate-v2`** for cursor-based paginated feeds

---

## 4. 📁 Project Structure

```
Streamify/
├── Backend/
│   ├── src/
│   │   ├── controllers/       # Business logic (9 files)
│   │   │   ├── user.controller.js         (14.4 KB)
│   │   │   ├── video.controller.js        (9.8 KB)
│   │   │   ├── playlist.controller.js     (6.4 KB)
│   │   │   ├── comment.controller.js      (6.3 KB)
│   │   │   ├── like.controller.js         (6.3 KB)
│   │   │   ├── tweet.controller.js        (4.8 KB)
│   │   │   ├── subscription.controller.js (4.2 KB)
│   │   │   ├── dashboard.controller.js    (3.1 KB)
│   │   │   └── healthCheck.controller.js  (0.2 KB)
│   │   ├── models/            # Mongoose Schemas (7 files)
│   │   │   ├── user.model.js
│   │   │   ├── video.model.js
│   │   │   ├── comment.model.js
│   │   │   ├── like.model.js
│   │   │   ├── playlist.model.js
│   │   │   ├── subscriptions.model.js
│   │   │   └── tweet.model.js
│   │   ├── routes/            # Express Routers (8 files)
│   │   ├── middlewares/       # Custom Middlewares (5 files)
│   │   │   ├── Auth.middleware.js
│   │   │   ├── multer.middleware.js
│   │   │   ├── generateOTP.middleware.js
│   │   │   ├── verifyOTP.middleware.js
│   │   │   └── mailer.middleware.js
│   │   ├── utils/             # Helper Utilities (5 files)
│   │   │   ├── apiError.js
│   │   │   ├── apiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── cloudinary.js
│   │   │   └── redisClient.js
│   │   ├── db/db.js           # MongoDB connection
│   │   ├── app.js             # Express app setup, CORS
│   │   └── index.js           # Server entry point
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable UI (5 files)
    │   ├── pages/             # Route-level pages (19 files)
    │   ├── data/              # Mock data (1 file)
    │   ├── App.tsx            # Root + Routing
    │   └── main.tsx           # React entry point
    ├── index.html
    ├── vite.config.ts
    └── tsconfig.json
```

---

## 5. 📊 Codebase Statistics

| Metric | Backend | Frontend |
|---|---|---|
| Language | JavaScript (ES Modules) | TypeScript + TSX |
| Total Source Files | 38 `.js` files | 29 `.ts`/`.tsx` files |
| Total Code Size | ~75 KB | ~172 KB |
| Controllers | 9 | — |
| DB Models | 7 | — |
| Routes | 8 | — |
| Middlewares | 5 | — |
| Utility Files | 5 | — |
| UI Components | — | 5 |
| Pages | — | 19 |

> **Total project source code: ~247 KB** (excluding node_modules)

---

## 5.5 🖼 Screenshots

````carousel
![Streamify — Home Page](C:/Users/jainb/.gemini/antigravity-ide/brain/a15512de-f330-4c8f-ad67-6e4a94c5611f/streamify_home_page_1780500777239.png)
<!-- slide -->
![Streamify — Video Watch Page](C:/Users/jainb/.gemini/antigravity-ide/brain/a15512de-f330-4c8f-ad67-6e4a94c5611f/streamify_watch_page_1780500800581.png)
<!-- slide -->
![Streamify — Creator Dashboard](C:/Users/jainb/.gemini/antigravity-ide/brain/a15512de-f330-4c8f-ad67-6e4a94c5611f/streamify_dashboard_1780500821762.png)
<!-- slide -->
![Streamify — Upload Video Page](C:/Users/jainb/.gemini/antigravity-ide/brain/a15512de-f330-4c8f-ad67-6e4a94c5611f/streamify_upload_page_1780500844640.png)
<!-- slide -->
![Streamify — Login / Authentication Page](C:/Users/jainb/.gemini/antigravity-ide/brain/a15512de-f330-4c8f-ad67-6e4a94c5611f/streamify_auth_page_1780500864446.png)
````

---

## 6. ✨ Features

### 🔐 Authentication & User Management
- User **registration** with avatar & cover image upload (Cloudinary)
- **Login / Logout** with JWT Access Token + Refresh Token
- **Token refresh** endpoint (silent re-auth)
- **OTP-based email verification** via Nodemailer
- **Change password** (with old password verification)
- **Update profile** — fullName, email, avatar, cover image
- Get **current user**, **channel profile** (by username), **watch history**

### 🎥 Video Management
- **Upload videos** with thumbnail (stored on Cloudinary)
- **Get all videos** — paginated, filterable, searchable
- **Get single video** — auto-increments view count
- **Update video** — title, description, thumbnail
- **Delete video** — removes from Cloudinary too
- **Toggle publish/unpublish** status

### 💬 Comments
- Add, edit, delete comments on videos
- Get all comments for a video (paginated)

### 👍 Likes
- Like / unlike **videos**, **comments**, **tweets**
- Get all **liked videos** for a user

### 📋 Playlists
- Create, update, delete playlists
- Add / remove videos from a playlist
- Get a specific playlist, or all playlists for a user

### 🔔 Subscriptions
- Subscribe / unsubscribe to channels
- Get list of **subscribers** for a channel
- Get channels a user is **subscribed to**

### 🐦 Tweets (Community Posts)
- Create, update, delete short posts
- Get all tweets by a user

### 📊 Dashboard & Analytics
- Channel stats — total views, subscribers, videos, likes
- All uploaded videos with detailed info
- Recharts-powered analytics charts on frontend

### 🛡️ Admin Panel
- Admin-level page for platform management

---

## 7. 🗄 Database Models

### User Model
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

### Video Model
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
| Model | Key Fields |
|---|---|
| **Comment** | `content`, `video` (ref), `owner` (ref) |
| **Like** | `video`/`comment`/`tweet` (ref), `likedBy` (ref) |
| **Playlist** | `name`, `description`, `videos[]`, `owner` (ref) |
| **Subscription** | `subscriber` (ref), `channel` (ref) |
| **Tweet** | `content`, `owner` (ref) |

---

## 8. 📡 API Endpoints Summary

### Total Endpoints: ~35+

| Module | Base Route | # Endpoints |
|---|---|---|
| Users | `/users` | 10 |
| Videos | `/videos` | 6 |
| Comments | `/comments` | 4 |
| Likes | `/likes` | 4 |
| Playlists | `/playlists` | 7 |
| Subscriptions | `/subscriptions` | 3 |
| Tweets | `/tweets` | 4 |
| Dashboard | `/dashboard` | 2 |

> ✅ = Auth required &nbsp;|&nbsp; ❌ = Public endpoint

All protected routes use the **`Auth.middleware.js`** middleware which verifies the JWT Access Token from `Authorization` header or cookies.

---

## 9. 🖥 Frontend Pages (19 Pages)

| Route | Page | Description |
|---|---|---|
| `/` | Home | Video feed with VideoCards |
| `/watch/:id` | Watch | Video player + comments + related |
| `/upload` | Upload | Upload new video with thumbnail |
| `/profile` | Profile | User profile & channel view |
| `/dashboard` | Dashboard | Creator dashboard overview |
| `/analytics` | Analytics | Recharts-based charts & stats |
| `/admin` | Admin | Admin management panel |
| `/playlists` | Playlists | Manage playlists |
| `/liked` | Liked Videos | All liked videos list |
| `/saved` | Watch Later | Saved/bookmarked videos |
| `/subscriptions` | Subscriptions | Subscribed channels feed |
| `/trending` | Trending | Trending video feed |
| `/explore` | Explore | Browse & search videos |
| `/history` | History | Watch history |
| `/notifications` | Notifications | Alerts & updates |
| `/settings` | Settings | Account settings |
| `/help` | Help | Help & support |
| `/login` | Login | Login page (no Navbar/Sidebar) |
| `/register` | Register | Registration page (no Navbar/Sidebar) |

---

## 10. 🧩 UI Components

| Component | Description |
|---|---|
| `Navbar.tsx` | Top navigation bar with search & user menu |
| `Sidebar.tsx` | Collapsible left sidebar with navigation links |
| `MobileNav.tsx` | Bottom navigation bar for mobile devices |
| `VideoCard.tsx` | Video thumbnail card shown in feeds |
| `TweetCard.tsx` | Community post card |

**Responsive Design:**
- Desktop: Navbar + Sidebar + main content
- Mobile: Navbar + Bottom MobileNav (no sidebar)
- Sidebar is collapsible and state is persisted via `localStorage`
- Auth pages (`/login`, `/register`) have a clean full-screen layout (no Navbar/Sidebar)

---

## 11. 🔧 Environment Configuration

```env
# Server
PORT=8000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>

# CORS
CORS_ORIGIN=*

# JWT
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ Redis connection is also configured in `utils/redisClient.js`

---

## 12. 🚀 How to Run

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Redis server (optional)

### Backend
```bash
cd Backend
npm install
# Create .env file with above variables
npm run dev         # Runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev         # Runs on http://localhost:5173
```

---

## 13. 📈 Learnings & System Design Concepts Applied

| Concept | Implementation |
|---|---|
| **JWT Auth** | Dual-token (access + refresh) with httpOnly cookies |
| **File Uploads** | Multer → local temp → Cloudinary → delete temp |
| **Caching** | Redis for frequently accessed data |
| **Pagination** | Mongoose aggregate paginate for video feeds |
| **Error Handling** | Custom `ApiError` class + `asyncHandler` wrapper |
| **Standardized Responses** | `ApiResponse` utility for consistent JSON output |
| **Aggregation Pipelines** | Watch history, channel stats, subscriber counts |
| **Email OTP** | Nodemailer with OTP middleware chain |
| **Media Management** | Cloudinary upload + delete on video removal |
| **Code Quality** | Prettier for consistent code formatting |

---

## 14. 🏆 Key Achievements & Metrics

> [!IMPORTANT]
> These metrics highlight the technical depth and scope of the project.

| # | Achievement |
|---|---|
| 🚀 | **Developed 35+ REST API endpoints** across 8 feature modules |
| 🔐 | **Implemented JWT dual-token authentication** — Access Token (1d) + Refresh Token (10d) with secure cookie handling |
| 🎨 | **Built 19 frontend pages** — fully responsive with mobile bottom-nav support |
| ⚙️ | **9 backend controllers** — each following clean MVC separation of concerns |
| ☁️ | **Integrated Cloudinary** for end-to-end media management (upload, store, delete) |
| ⚡ | **Integrated Redis caching** layer to reduce database load on frequent queries |
| 📦 | **7 Mongoose models** with proper relationships, indexing, and aggregation pipelines |
| 📊 | **MongoDB Aggregation Pipelines** for complex queries (watch history, channel stats, subscriber counts) |
| 📧 | **OTP-based email verification** using Nodemailer middleware chain |
| 🏗️ | **Designed scalable MVC architecture** with custom error handling, standardized API responses, and async wrappers |
| 📱 | **Fully responsive UI** — Desktop sidebar + Mobile bottom nav, sidebar state persisted in `localStorage` |
| 🧹 | **Code quality enforced** with Prettier across the entire backend codebase |

### 📊 By the Numbers

```
✅  35+  REST API endpoints
✅  19   Frontend pages (React + TypeScript)
✅   9   Backend controllers
✅   7   Mongoose database models
✅   5   Custom Express middlewares
✅   5   Reusable React components
✅   5   Utility helper modules
✅   8   Express route modules
✅ 247KB Total source code
```

---

## 15. 🔮 Future Scope

- [ ] Connect frontend to real backend APIs (currently uses `mockData.ts`)
- [ ] Add real-time notifications using WebSockets
- [ ] Implement video search with full-text indexing
- [ ] Add TypeScript to backend (currently plain JS)
- [ ] Video recommendations using ML-based algorithms
- [ ] Mobile app (React Native)
- [ ] Deploy backend on Render/Railway + frontend on Vercel

---

## 16. 👤 Author

**Bhavya Jain**
- GitHub: [@Bhavya5jain](https://github.com/Bhavya5jain)
- Repository: [Streamify](https://github.com/Bhavya5jain/Streamify)

---

> ⭐ *This project demonstrates a strong understanding of full-stack development, RESTful API design, JWT authentication, cloud media management, and modern React development with TypeScript.*
