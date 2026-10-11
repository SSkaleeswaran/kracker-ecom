# Kart — MERN E-Commerce Shopping Website

React (Vite) + Express + MongoDB + JWT. Covers every page, role and API from the project guide.

## Setup

Requirements: Node 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
npm run install-all     # installs root, backend and frontend packages
npm run seed            # optional: creates demo admin, user, categories, products
npm run dev             # starts API (port 5000) and web app (port 5173)
```

Open http://localhost:5173

Edit `backend/.env` to change `MONGO_URI`, `PORT` or `JWT_SECRET`.

## Demo accounts (after `npm run seed`)

| Role  | Email          | Password |
|-------|----------------|----------|
| Admin | admin@shop.com | admin123 |
| User  | user@shop.com  | user123  |

Admin panel: http://localhost:5173/admin/login

## Features

- Register / login with bcrypt-hashed passwords and JWT (7 days)
- Product catalogue with search, category and price filters
- Cart (server-side, stock-checked), wishlist toggle, checkout, order history
- Admin: dashboard stats, product CRUD, category CRUD, order status updates
  (cancelling an order restores stock)
- Responsive layout, validation on both frontend and backend

## API summary

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET/PUT | /api/auth/profile | user |
| GET | /api/products (?search&category&minPrice&maxPrice&page&limit), /api/products/:id | public |
| POST/PUT/DELETE | /api/products, /api/products/:id | admin |
| GET | /api/categories, /api/categories/:id | public |
| POST/PUT/DELETE | /api/categories, /api/categories/:id | admin |
| GET/POST | /api/cart; PUT/DELETE /api/cart/:productId | user |
| GET | /api/wishlist; POST /api/wishlist/:productId (toggle) | user |
| POST | /api/orders (checkout); GET /api/orders/my | user |
| GET | /api/orders; PUT /api/orders/:id (status) | admin |
| GET | /api/admin/stats | admin |

## Notes

- `bcryptjs` is used instead of `bcrypt` (same API, no native build step, installs everywhere).
- The Vite dev server proxies `/api` to `localhost:5000`, so there is no CORS or URL config in dev.
- Prices display in `$`; change the `money` helper in `frontend/src/utils.js` for another currency.
