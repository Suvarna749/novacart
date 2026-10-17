# NovaCart Online Store

**KIYORAX TECHNOLOGIES — Task 3: E-Commerce Website**

NovaCart is a full-stack demo e-commerce application built with React + Vite, Express, PostgreSQL, and Prisma. It includes a responsive storefront, search/filter/sort, customer registration/login, cart, checkout, order history, a mock payment flow, and a protected admin dashboard.

> **Payment notice:** Online payment is simulated for assignment/demo use only. No real payment processor is connected and no real card information is collected.

## Features

- Responsive storefront, product categories, product detail pages, product cards and curated homepage.
- PostgreSQL-backed product/category APIs and seeded catalogue (12 products across 5 categories).
- Registration/login with bcrypt password hashing, JWT authentication, HTTP-only cookie support, and admin role middleware.
- Search, category filter, price filter, sorting, stock visibility and cart quantity validation.
- Server-calculated checkout totals and transactional stock decrement/order creation.
- Customer order history and private order access.
- Cash on Delivery and clearly labelled mock online payment outcome.
- Admin product creation/deactivation, product listing, order listing and order status updates.
- Environment variable templates, Prisma schema, seed script and setup guide.

## Requirements

- Node.js 20 or newer recommended
- npm
- PostgreSQL 14 or newer

## 1. Create the database

Start PostgreSQL and create a database named `novacart`. For example, in `psql`:

```sql
CREATE DATABASE novacart;
```

## 2. Configure the backend

Open a terminal in the project root:

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and update `DATABASE_URL` with your PostgreSQL username/password. Replace `JWT_SECRET` with a unique random secret of at least 32 characters. Set a private admin password in `ADMIN_PASSWORD` before seeding.

Example local configuration (edit the password to match your PostgreSQL setup):

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/novacart?schema=public"
JWT_SECRET=replace_this_with_a_long_random_secret_at_least_32_characters
JWT_EXPIRES_IN=1d
ADMIN_NAME=NovaCart Admin
ADMIN_EMAIL=admin@novacart.local
ADMIN_PASSWORD=ChangeThisBeforeSeeding123!
```

Generate Prisma Client, create the schema tables and seed the demo products/admin:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

The API should run at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

For a local assignment/demo, `prisma db push` is the simplest setup. To create migration files for a longer-lived development project, run `npx prisma migrate dev --name init` instead of `npx prisma db push`.

## 3. Start the frontend

Open a second terminal from the project root:

```bash
cd client
npm install
```

Copy `client/.env.example` to `client/.env` if you need to change the API URL. Then run:

```bash
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Optional root scripts

From the root directory you can also run:

```bash
npm install
npm run install:all
npm run dev
```

This starts frontend and backend together after dependencies and database configuration are ready.

## Admin access

The seed script creates/updates the admin using the values in `server/.env`:

- Email: value of `ADMIN_EMAIL` (example: `admin@novacart.local`)
- Password: value of `ADMIN_PASSWORD` (example only; change it before use)

Sign in on the frontend with these values. The API uses a database role check for every admin route. Never deploy the example password or commit `.env` files.

## Main API routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| POST | `/api/auth/register` | Register customer |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Current user |
| GET | `/api/products` | List/search/filter/sort products |
| GET | `/api/products/:id` | Product detail and related products |
| GET | `/api/categories` | List categories |
| GET | `/api/categories/:id/products` | Products in category |
| GET/POST | `/api/cart`, `/api/cart/items` | View/update cart |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/my-orders` | Customer order history |
| GET | `/api/orders/:id` | Private order details |
| POST | `/api/payments/mock` | Simulate a test payment |
| GET | `/api/admin/dashboard` | Admin metrics |
| GET/POST | `/api/admin/products` | List/create products |
| PATCH/DELETE | `/api/admin/products/:id` | Update/deactivate product |
| GET | `/api/admin/orders` | List orders |
| PATCH | `/api/admin/orders/:id/status` | Update order status |
| GET | `/api/admin/customers` | List customers |

Protected APIs expect the JWT bearer token returned by login/register. The app also sets an HTTP-only cookie for browser sessions.

## Checkout and payment notes

- Delivery form requires a valid six-digit PIN code and contact details.
- Shipping is free for a subtotal of ₹2,999 or more; otherwise it is ₹99.
- Backend recalculates prices and totals from PostgreSQL and uses a transaction to decrement stock and create order records.
- Choose **Cash on Delivery** or **Mock Online Payment (TEST ONLY)**. The mock payment endpoint accepts `outcome: "success"` or `outcome: "failure"` and never contacts a real payment network.

## GitHub

Create a new empty GitHub repository, then from the project root:

```bash
git init
git add .
git commit -m "Build NovaCart e-commerce project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Check `git status` and make sure `.env` files are not staged before pushing.

## Troubleshooting

- **Database connection failed:** Ensure PostgreSQL is running, the database exists, and `DATABASE_URL` credentials are correct.
- **Prisma Client missing:** Run `npx prisma generate` from `server/`.
- **No products in database:** Run `npm run db:seed` from `server/`.
- **Admin sign-in rejected:** Check `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env`, then rerun `npm run db:seed`.
- **Browser cannot call the API:** Confirm the backend is running on port 5000 and `CLIENT_URL` includes the Vite URL.
- **Checkout requires sign-in:** Register a customer account first. The checkout creates a persistent order in PostgreSQL.
- **Mock payment:** It is a simulation for the assignment only; do not use real card details.

## Scope notes

This is an assignment/demo implementation. Password reset email delivery, production-grade file uploads, external payment gateway credentials, email/SMS notifications, and production deployment configuration are not connected. Product images use remote image URLs. Test the app locally before submitting it as a working demo.
