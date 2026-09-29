# Online Movie Ticket Booking System

A full-stack Online Movie Ticket Booking System built with:

- React.js + Vite
- Express.js
- MongoDB + Mongoose
- JWT authentication
- REST API
- Responsive CSS UI

## Features

- User registration and login
- Movie listing
- Search movies
- Genre/language filters
- Movie details
- Show-time selection
- Seat selection with booked-seat prevention
- Ticket booking
- Booking history
- Booking cancellation
- Responsive desktop/mobile UI
- MongoDB seed script with sample movies and shows

## Project structure

```text
online-movie-ticket-booking/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/auth.js
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Requirements

Install:

- Node.js 18+
- MongoDB 6+ (local MongoDB or MongoDB Atlas)

## 1. Start MongoDB

For a local MongoDB installation, make sure the MongoDB service is running.

Default database URL:

```text
mongodb://127.0.0.1:27017/movie_booking
```

## 2. Backend setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env`.

On Windows:

```powershell
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Seed sample movies and shows:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

## 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

or:

```bash
cp .env.example .env
```

Start frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo account

After seeding, a demo user is created:

```text
Email: demo@example.com
Password: demo123
```

You can also register a new account.

## API overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Movies

- `GET /api/movies`
- `GET /api/movies/:id`

### Shows

- `GET /api/shows/movie/:movieId`
- `GET /api/shows/:id/seats`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings/my`
- `PATCH /api/bookings/:id/cancel`

## Important

This project is designed as an academic/full-stack demonstration. Payment is simulated; no real payment gateway is connected.

For production use, add a payment provider, HTTPS, stronger validation/rate limiting, distributed seat locking, email/SMS notifications, and production-grade deployment configuration.
