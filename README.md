# YelpCamp

Discover and share the best campgrounds. This is a full‑stack Node.js web app where users can sign up, create campground listings with photos and maps, leave reviews, and manage their own content.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Seeding the Database](#seeding-the-database)
  - [Run the App](#run-the-app)
- [Scripts](#scripts)
- [API & Routes](#api--routes)
- [Security & Best Practices](#security--best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete (CRUD) campgrounds
- Upload images for campgrounds (local or a cloud provider like Cloudinary)
- Map & geocoding support (e.g., Mapbox) for campground locations
- Reviews & ratings for campgrounds
- Flash messages and server-side validation
- Mobile‑friendly EJS views

> If your fork disables any of these features, remove or adjust the bullets.

---

## Tech Stack

- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **Views:** EJS templates + Express layouts, client‑side JS in `public/`
- **Auth:** Passport (LocalStrategy) + express‑session + connect‑flash
- **Validation:** JOI (celebrate/joi or joi), custom middleware
- **Security:** helmet, express‑mongo‑sanitize, sanitization utilities
- **Uploads/Media (optional):** Multer (+ storage adapter), Cloudinary
- **Maps (optional):** Mapbox SDK/GL JS

> Check `package.json` for the exact dependency versions in your clone.

---

## Project Structure

```
YelpCamp/
├─ models/            # Mongoose models (e.g., Campground, Review, User)
├─ routes/            # Express route modules (campgrounds, reviews, users)
├─ views/             # EJS templates (campgrounds, reviews, layouts, partials)
├─ public/            # Static assets (CSS/JS/images)
│  └─ javascripts/    # Client-side JS
├─ seeding/           # Seed scripts & sample data
├─ utils/             # Helpers (e.g., async wrapper, Cloudinary, Mapbox, etc.)
├─ middleware.js      # Custom middleware (isLoggedIn, validateX, etc.)
├─ schemas.js         # JOI validation schemas
├─ index.js           # App entry point (Express server)
├─ package.json       # Scripts & dependencies
└─ .gitignore
```

---

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **MongoDB** (local or a managed instance like MongoDB Atlas)
- (Optional) **Cloudinary** account for image storage
- (Optional) **Mapbox** account for geocoding & maps

### Environment Variables

Create a `.env` file in the project root. Typical variables for a YelpCamp‑style app are:

```
# Server
PORT=3000
NODE_ENV=development
SESSION_SECRET=change-this-secret

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/yelp-camp
# or for Atlas: mongodb+srv://<user>:<password>@cluster-url/yelp-camp

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_KEY=xxxx
CLOUDINARY_SECRET=xxxx

# Mapbox (optional)
MAPBOX_TOKEN=xxxx
```

> Rename variables to match your actual code if they differ.

### Installation

```bash
# Clone the repo (or use your existing clone)
# git clone https://github.com/<your-username>/YelpCamp.git
cd YelpCamp

# Install dependencies
npm install
```

### Seeding the Database

If the project includes seed data, you can seed your database:

```bash
# Example—adjust the path or script name to match your repo
node seeding/index.js
```

### Run the App

```bash
# Development (with live reload if nodemon is installed)
npm run dev

# or plain Node
npm start
```

Then open: `http://localhost:3000`

---

## Scripts

Common scripts (actual names may vary—check `package.json`):

- `start` – start the server with Node
- `dev` – start the server with nodemon
- `seed` – run the seed script
- `lint` – run linters if configured

---

## API & Routes

The app uses standard RESTful routes. Names may vary, but a typical layout is:

### Campgrounds

```
GET    /campgrounds            # list all campgrounds
GET    /campgrounds/new        # show form to create
POST   /campgrounds            # create
GET    /campgrounds/:id        # show one
GET    /campgrounds/:id/edit   # edit form
PUT    /campgrounds/:id        # update
DELETE /campgrounds/:id        # delete
```

### Reviews

```
POST   /campgrounds/:id/reviews
DELETE /campgrounds/:id/reviews/:reviewId
```

### Auth

```
GET    /register
POST   /register
GET    /login
POST   /login
GET    /logout
```

---

## Security & Best Practices

- Use strong, unique `SESSION_SECRET` in production
- Trust proxy & set secure cookies when behind a proxy (Heroku, Render, etc.)
- Set appropriate `helmet` CSP if loading Mapbox/Cloudinary
- Validate all inputs with JOI and sanitize HTML inputs
- Limit file uploads and validate MIME types
- Store secrets in environment variables (never in the repo)

---

## Troubleshooting

- **"MongooseServerSelectionError"** – Is MongoDB running and `MONGODB_URI` correct?
- **Uploads not working** – Check your Multer storage (disk vs Cloudinary) and env vars
- **Map not loading** – Verify `MAPBOX_TOKEN` and CSP headers
- **Session/flash not working** – Confirm session store and cookie settings

---
