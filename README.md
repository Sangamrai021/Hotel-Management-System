# Hotel Management System

A full-stack Hotel Management System built with the MERN stack (MongoDB, Express, React, Node.js) as a college project. This is an admin-only panel that demonstrates real-world usability including CRUD operations, business logic, and document generation.

---

## Tech Stack

**Backend**
- Node.js (v22)
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

**Frontend**
- React (Vite)
- React Router DOM
- Axios

---

## Features

### Authentication
- Admin Login with JWT
- Protected Routes
- Token stored in localStorage
- Auto redirect to login if not authenticated

### Room Management
- Add / Edit / Delete Rooms
- Search by Room Number
- Filter by Room Type (Standard, Deluxe, Suite)
- Filter by Status (Available, Occupied)
- Pagination (10 rooms per page)
- Validation: Room number must contain at least one number

### Guest Management
- Add / Edit / Delete Guests
- Search by Name, Email or Phone
- Pagination (10 guests per page)
- Validation:
  - Name: letters and spaces only
  - Email: must be a valid email (e.g. john@gmail.com)
  - Phone: must start with 97 or 98, exactly 10 digits
  - ID Number: numbers only

### Booking Management
- Create Booking (guest + room + dates)
- View all Bookings with status filter
- Pagination (10 bookings per page)
- Booking Status Flow:
  - Booked → CheckedIn → CheckedOut
  - Booked → Cancelled
- Room availability check before booking
- Double booking prevention
- Room status auto-updates (Available / Occupied)
- Cannot delete an active CheckedIn booking
- Cannot delete a guest with active bookings

### Billing & Invoice
- Generate Invoice from a completed booking
- Invoice is an immutable snapshot (frozen at generation time)
- One invoice per booking only
- View Invoice with full details
- Print / Download as PDF (browser print)

### Dashboard
- Total Rooms
- Occupied Rooms
- Available Rooms
- Total Guests
- Bookings Today
- Revenue This Month

---

## Project Structure

    HMS/
    ├── server/                  # Node + Express Backend
    │   ├── config/
    │   │   └── db.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── roomController.js
    │   │   ├── guestController.js
    │   │   ├── bookingController.js
    │   │   ├── invoiceController.js
    │   │   └── dashboardController.js
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── models/
    │   │   ├── Admin.js
    │   │   ├── Room.js
    │   │   ├── Guest.js
    │   │   ├── Booking.js
    │   │   └── Invoice.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── roomRoutes.js
    │   │   ├── guestRoutes.js
    │   │   ├── bookingRoutes.js
    │   │   ├── invoiceRoutes.js
    │   │   └── dashboardRoutes.js
    │   ├── seed/
    │   │   ├── seedAdmin.js
    │   │   └── seedData.js
    │   ├── .env
    │   ├── package.json
    │   └── server.js
    │
    └── client/                  # React Frontend
        ├── src/
        │   ├── api/
        │   │   └── axios.js
        │   ├── context/
        │   │   └── AuthContext.jsx
        │   ├── components/
        │   │   ├── Navbar.jsx
        │   │   └── ProtectedRoute.jsx
        │   ├── pages/
        │   │   ├── Auth/Login.jsx
        │   │   ├── Dashboard/Dashboard.jsx
        │   │   ├── Rooms/
        │   │   ├── Guests/
        │   │   ├── Bookings/
        │   │   └── Invoices/
        │   ├── App.jsx
        │   └── main.jsx
        └── package.json


---

## Setup & Installation

### Prerequisites
- Node.js v22+
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/hotel-management-system.git
cd hotel-management-system
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `.env` file inside `server/`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=hotel_super_secret_key_2026
PORT=9000
```

### 3. Seed the database
```bash
# Create admin user (run once)
npm run seed

# Seed sample rooms and guests (optional)
npm run seed-data
```

### 4. Start Backend
```bash
npm run dev
```

### 5. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```

### 6. Open in browser
[Frontend](https://hotel-management-system-sable-eight.vercel.app)
[Backend](https://hotel-management-system-8n2a.onrender.com)

### 7. Login credentials
Email:    admin@gmail.com
Password: admin123
> ⚠️ These are demo credentials for development only. Change them in production by updating `seed/seedAdmin.js` and re-running `npm run seed`.

---

## 📡 API Reference

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/rooms` | List rooms (search, filter, paginate) |
| POST | `/api/rooms` | Create room |
| GET | `/api/rooms/:id` | Get room by ID |
| PUT | `/api/rooms/:id` | Update room |
| DELETE | `/api/rooms/:id` | Delete room |
| GET | `/api/guests` | List guests (search, paginate) |
| POST | `/api/guests` | Create guest |
| GET | `/api/guests/:id` | Get guest by ID |
| PUT | `/api/guests/:id` | Update guest |
| DELETE | `/api/guests/:id` | Delete guest |
| GET | `/api/guests/:id/bookings` | Guest booking history |
| GET | `/api/bookings` | List bookings (filter, paginate) |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id` | Get booking by ID |
| PATCH | `/api/bookings/:id/status` | Update booking status |
| DELETE | `/api/bookings/:id` | Delete booking |
| GET | `/api/bookings/check-availability` | Check room availability |
| POST | `/api/invoices/booking/:bookingId` | Generate invoice |
| GET | `/api/invoices/booking/:bookingId` | Get invoice by booking |
| GET | `/api/invoices` | List all invoices |

---

## Validation Rules

| Field | Rule |
|-------|------|
| Room Number | Must contain at least one number, letters and hyphens allowed |
| Room Price | Must be a positive number |
| Guest Name | Letters and spaces only |
| Guest Email | Valid email with domain minimum 4 characters |
| Guest Phone | Must start with 97 or 98, exactly 10 digits |
| Guest ID Number | Numbers only |
| Check-out Date | Must be after check-in date |
| Booking | Same room cannot be double booked for overlapping dates |

---

## College Project Info

- **Project:** Hotel Management System (Admin Panel)
- **Stack:** MERN (MongoDB, Express, React, Node.js)
- **Demonstrates:** CRUD operations, business logic, document generation, real-world usability