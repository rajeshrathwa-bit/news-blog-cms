# News Blog CMS — MERN Stack Project

A full-stack news blog content management system built with the **MERN stack**
(MongoDB, Express.js, React, Node.js).

- **Public site** — visitors browse news by category, search, read articles and post comments.
- **Admin** — full content management: articles, categories, users, comments and site settings.
- **Author** — writes and manages their own articles.

Content is managed through a role-based admin panel, and the public site in which
everyone can browse and comment is served from the same application.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Setup & Run](#setup--run)
5. [Database Setup (seed data)](#database-setup--seed-data)
6. [Test Login Credentials & Roles](#test-login-credentials--roles)
7. [Role Comparison Table](#role-comparison-table)
8. [Quick Start Walkthroughs](#quick-start-walkthroughs)
9. [API Overview](#api-overview)
10. [Postman Collection](#postman-collection)
11. [Running Tests](#running-tests)
12. [Submission Deliverables Checklist](#submission-deliverables-checklist)
13. [Project Development Plan](#project-development-plan)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router, Vite |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (httpOnly cookie), bcrypt password hashing |
| Uploads | Multer (images, max 5 MB) |
| Testing | Jest + Supertest |
| Extras | express-validator, node-cache, mongoose-paginate-v2, slugify, compression |

---

## Project Structure

```
news-blog-cms/
├── backend/                # Express + MongoDB API
│   ├── models/             # User, Category, News, Comment, Setting schemas
│   ├── routes/             # api.js (public), admin.js (admin panel)
│   ├── controllers/        # business logic per resource
│   ├── middleware/         # isLoggedin, isAdmin, validation, multer, errors
│   ├── utils/              # cache, paginate, error-message
│   ├── test/               # Jest + Supertest backend tests
│   ├── seed.js             # database seed script
│   ├── app.js              # Express app entry
│   ├── .env.example        # environment config template
│   └── package.json
└── client/                 # React + Vite frontend
    ├── src/
    │   ├── pages/          # public pages + pages/admin (admin panel)
    │   ├── components/     # layouts, sidebar, article list
    │   ├── context/        # AuthContext (login/logout state)
    │   └── api.js          # fetch wrapper for /api calls
    ├── public/uploads/     # uploaded article images & logos
    └── package.json
```

---

## Prerequisites

- Node.js **18+** (tested on Node 22)
- MongoDB running locally on `localhost:27017`
- Two terminals

---

## Setup & Run

### 1. Configure the environment

```bash
cd backend
copy .env.example .env    # Windows
# or: cp .env.example .env # Linux/macOS
```

`backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/news-cms-blog
JWT_SECRET=your-secure-jwt-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

> `.env` is git-ignored — never commit real secrets.

### 2. Start the backend

```bash
cd backend
npm install
npm run dev         # or: npm start
```

Expected output: `Server is running on port 3000`

### 3. Start the frontend

Open a **second** terminal:

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**.

---

## Database Setup (seed data)

`npm run seed` (run inside `backend/`, with MongoDB up) clears and repopulates
the database with a working demo set:

| Type | Data |
|------|------|
| Settings | Website title, footer text |
| Users | 1 admin, 1 author |
| Categories | Sports, Technology, Business |
| Articles | 4 articles with placeholder images |
| Comments | 1 approved, 1 pending |

```bash
cd backend
npm run seed
```

> Re-running `npm run seed` wipes the existing development data first.

---

## Test Login Credentials & Roles

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Author | `rahul` | `rahul123` |

Login at: **http://localhost:5173/admin/login**

| Role | Can do |
|------|--------|
| **Admin** | articles, categories, users, settings, all comments |
| **Author** | only their own articles + comments on them |
| **Visitor** | browse, search, read, post comments (no login) |

> A visitor's comment is stored as `pending` and only becomes public after an
> admin/author approves it in **Admin → Comments**.

> ⚠️ When creating users through scripts, pass the **plain** password — the User
> model hashes it automatically. Pre-hashing causes double-hashing and login failure.

---

## Role Comparison Table

| Capability | Admin | Author | Visitor |
| --- | :---: | :---: | :---: |
| View public site | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ❌ |
| Create article | ✅ | ✅ | ❌ |
| Edit/delete own articles | ✅ | ✅ | ❌ |
| Edit/delete any article | ✅ | ❌ | ❌ |
| Manage categories | ✅ | ❌ | ❌ |
| Manage site settings | ✅ | ❌ | ❌ |
| Moderate comments (approve/delete) | ✅ | ✅ (on own articles) | ❌ |
| Manage users (incl. authors) | ✅ | ❌ | ❌ |
| Post a comment on an article | ✅ | ✅ | ✅ |

| Feature | Where enforced |
| --- | --- |
| JWT authentication for admin/author routes | `backend/middleware/isLoggedin.js` |
| Role check (`isAdmin`) | `backend/middleware/isAdmin.js` |
| Comment approval gate | admin endpoint; page shows only approved |

**Why a category may not appear on the home menu:** the site only lists categories
that currently have at least one article. Add an article to it. Site data is also
cached for 1 hour (`backend/utils/cache.js`).

---

## Quick Start Walkthroughs

### Admin — data insertion & site settings

1. Log in at http://localhost:5173/admin/login with `admin` / `admin123`.
2. The menu shows Home, Contact, the admin panel link, and logout.
3. Open **Admin → Dashboard**:
   - Manage **categories** (add / edit / delete).
   - Manage **news articles** (add / edit / delete; upload a cover image from
     `client/public/uploads/`, e.g. the seed images `seed-*.jpg`).
   - Moderate **comments** (approve/delete pending entries).
4. Edit **site settings** (title / tagline / footer / logo).
5. Optional: add an author account under **Users** (role = `author`).

### Author — article workflow

1. Log in at http://localhost:5173/admin/login with `rahul` / `rahul123`.
2. The panel lists the author's **own** articles only.
3. **Create an article**: pick a category, enter title, slug, summary, body and a
   cover image; it is published immediately.
4. **Edit / delete** only your own articles — authors cannot touch other users' content.
5. Authors **cannot** manage categories, settings, users, or approve comments on
   others' articles (enforced by `backend/middleware/isAdmin.js`).

### Visitor — browsing & comments

1. Open http://localhost:5173 — no login needed.
2. **Home:** hero, latest news, in-use categories, latest/popular sections.
3. **Category page:** filter articles by category.
4. **Single article:** full text + cover image + comments.
5. **Post a comment:** any visitor can submit a name + message; it is stored as
   `pending` and shown publicly only after approval.
6. **Contact page:** information form stored via the API.

---

## API Overview

Public routes (`backend/routes/api.js`):

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/site` | settings, latest 5 news, in-use categories |
| GET | `/api/news` | paginated article list |
| GET | `/api/news/:id` | single article + approved comments |
| POST | `/api/news/:id/comments` | add a comment (pending) |
| GET | `/api/categories/:slug/news` | articles by category |
| GET | `/api/search?search=` | search title/content |
| GET | `/api/authors/:id/news` | articles by author |
| POST | `/api/auth/login` | login (sets JWT cookie) |
| GET | `/api/auth/me` | current user |
| POST | `/api/auth/logout` | logout |

Admin routes (`backend/routes/admin.js`, JWT required):

| Method | Endpoint | Roles |
|--------|----------|-------|
| GET | `/api/admin/dashboard` | logged in |
| CRUD | `/api/admin/articles` + `/:id` | logged in (owner check for authors) |
| CRUD | `/api/admin/categories` + `/:id` | admin |
| CRUD | `/api/admin/users` + `/:id` | admin |
| GET/PUT | `/api/admin/comments/:id/status`, DELETE | logged in (scoped for authors) |
| GET/PUT | `/api/admin/settings` | admin |

---

## Postman Collection

Import `postman/News-Blog-CMS-API.postman_collection.json` into Postman.

It contains three folders: **Auth**, **Public Site**, and **Admin** — covering
login, public browsing, and every admin CRUD call. Admin calls use the JWT cookie
set by the login request.

---

## Running Tests

```bash
cd backend
npm test
```

Runs **26 Jest + Supertest** backend tests covering auth, role protection
(admin vs author), article CRUD and the comment moderation lifecycle. Tests use a
separate database `news-cms-test` and never touch development data.

| File | Covers |
| --- | --- |
| `test/auth.test.js` | login success/failure, token issuance, protected routes reject anonymous users |
| `test/admin.test.js` | article & category CRUD as admin, comment approval, unauthorized author gets 403 |
| `test/public.test.js` | homepage site-data, category & article lookup, article comments |

---

## Submission Deliverables Checklist

| Deliverable | Location | Status |
| --- | --- | --- |
| Project brief | this README + report PDF | ✅ done |
| Data model / ER diagram | `docs/database-er-diagram.svg` | ✅ done |
| Backend REST API | `backend/` | ✅ done |
| Frontend (React/Vite) | `client/` | ✅ done |
| End-to-end flow demo | `docs/SCREENSHOTS.md` + recorded video | ✅ capture |
| Auth (login, JWT, roles) | `backend/middleware/` | ✅ done |
| Automated tests | `backend/test/` (26) | ✅ done |
| DB seed script | `backend/seed.js` | ✅ done |
| README (incl. credentials) | `README.md` | ✅ done |
| Postman collection | `postman/` | ✅ done |
| Screenshots guide | `docs/SCREENSHOTS.md` | ✅ capture |
| Presentation (PDF, 2–4 pages) | `docs/report/Project-Report.pdf` | ✅ done |
| Logos (BIT, IIT, IBM) | project root (`BIT-logo.png`, `IBM & IIT ...`) | ✅ done |
| Drive folder `01–07` + share link | run `scripts/prepare-submission.js` | ✅ staged |
| GitHub repo `RollNo_StudentName_Track_FinalProject` | `rajeshrathwa-bit/BIT0123_Rajesh_Rathwa_MERN_FinalProject` | ⏳ rename |

---

## Project Development Plan

**Problem statement:** a news blog needs a way for admin + author staff to publish
articles and for visitors to read and comment, with proper roles.

1. **Requirements & brief** — defined roles (admin/author/visitor), data entities,
   and the tech stack (MERN).
2. **Data model (ER)** — users, categories, news, comments, settings → drawn in
   `docs/database-er-diagram.svg`.
3. **Backend API** — Express REST routes under `/api/user`, `/api/site`,
   `/api/admin/...`; JWT auth; role middleware; image upload; pagination util.
4. **Frontend** — Vite React public site (home, category, article, contact) +
   a login-redirected admin panel; CSS in `public/css/style.css`.
5. **End-to-end wiring** — `/api` and `/uploads` proxied to port 3000; categories
   shown only when they contain articles; 1-hour site-data cache.
6. **Testing** — 26 Jest + Supertest tests (`backend/test/`) against a throwaway DB.
7. **Handover docs** — this README, the Postman collection (`postman/`), ER diagram,
   and `docs/SCREENSHOTS.md`.
8. **Submission packaging** — `node scripts/prepare-submission.js` builds the
   `BIT0123_Rajesh_Rathwa_MERN_FinalProject` folder with `01_Source_Code` …
   `07_Video_Recording`; copy it into Google Drive, share *Anyone with the link*,
   rename the GitHub repo to the same convention, and record the demo video.

---

© 2026 — News Blog CMS • Built by the Software Development (MERN) track.