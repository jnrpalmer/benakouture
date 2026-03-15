# Bena Kouture

Full-stack e-commerce fashion website. Wine red and white theme, mid-level fashion brand style.

## Project structure

- **frontend/** — HTML, CSS, JavaScript (static site)
- **backend/** — Node.js + Express API
- **database/** — MongoDB (connection string in backend `.env`)

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (copy from `.env.example`):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bena-kouture
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

Create admin user (run once):

```bash
node scripts/seedAdmin.js
```

Default admin: **admin@benakouture.com** / **admin123**

Start API:

```bash
npm start
```

### 2. Frontend

Serve the `frontend` folder with any static server. Examples:

- **VS Code Live Server**: Open `frontend/index.html`, then "Go Live". Usually runs at `http://127.0.0.1:5500/frontend/` — if so, open `http://127.0.0.1:5500/frontend/` in the browser.
- **Node (serve)**:
  ```bash
  npx serve frontend
  ```
- Or open `frontend/index.html` directly (typing animation and login will work; API calls need backend and may need CORS if using file://).

**Important:** If your frontend URL is different from `http://localhost:5500`, update `API_BASE` in `frontend/js/app.js` to match your backend (e.g. `http://localhost:3000/api`). It is currently set to `http://localhost:3000/api`.

### 3. Use the site

1. Open the site (e.g. `http://127.0.0.1:5500/frontend/index.html` or your static server URL).
2. Watch the welcome typing animation, then you’ll be redirected to the login page.
3. **Register** a new account or **log in** as admin: `admin@benakouture.com` / `admin123`.
4. Browse Home, Shop, About, Contact; add products (admin only) from Home/Shop “+ Add Item” or from the Admin dashboard.
5. Add items to cart, go to Cart, then Checkout. Enter name, phone, delivery address and submit for order confirmation.

## Features

- **Welcome screen** — Typing animation then redirect to login
- **Auth** — Login/register; JWT; all pages require login except welcome and login
- **Pages** — Home, Shop, About, Contact, Cart, Checkout
- **Products** — List, add to cart; admin can add/edit/delete and upload images
- **Admin** — Hidden dashboard at `admin.html`; only admin users can open it and see “+ Add Item”
- **Checkout** — Customer name, phone, delivery address; order confirmation

## Security

- All app pages (except welcome and login) require a valid token; otherwise redirect to login.
- Only admin users can access `admin.html`, add/edit/delete products, and see “+ Add Item”.
- Customers cannot change prices; only admins can modify products and pricing via the API.
