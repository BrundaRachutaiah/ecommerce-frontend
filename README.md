# ShopEase — E-Commerce Frontend

A full-stack e-commerce web app where you can browse products, manage your cart and wishlist, place orders, and manage your profile and addresses.
Built with **React 19**, **React Bootstrap**, and **Vite** — connected to an **Express/Node** backend with **MongoDB** — deployed on **Vercel**.

---

## 🔗 Demo Link

**Live Demo:** https://www.loom.com/share/e61d9bc6d7294b0ca57da44b7f0071af

---

## ⚡ Quick Start

```bash
git clone https://github.com/BrundaRachutaiah/ecommerce-frontend.git
cd ecommerce-frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.


> In development, all `/api` requests are proxied to the backend via Vite's proxy config.

---

## 🛠️ Technologies

| Layer        | Tech                                  |
|--------------|---------------------------------------|
| Frontend     | React 19, React Router DOM v7         |
| UI Library   | Bootstrap 5, React Bootstrap 2        |
| Icons        | React Icons 5                         |
| HTTP Client  | Axios                                 |
| Bundler      | Vite 7                                |
| Deployment   | Vercel                                |
| Backend      | Node.js, Express, MongoDB             |

---

## ✨ Features

### 🏠 Home
- Category strip with clickable category cards — navigates to filtered product list
- Hero banner
- New Arrivals and Sale Items promotional cards

### 🛍️ Product Listing (`/products`)
- Responsive product grid
- **Sidebar filters:** Category (multi-select checkboxes), Rating (3★/4★ and above), Sort by price (Low to High / High to Low)
- **Search** from the header — real-time URL-synced search
- Filters and search synced with URL query params

### 📦 Product Details (`/product/:id`)
- Full product info: image, name, price, original price, discount badge, rating stars, stock count
- **Size selection** (if available)
- **Quantity selector** (respects stock limit)
- **Add to Cart** and **Buy Now** buttons
- **Wishlist toggle** (heart icon) — adds or removes from wishlist
- **Featured Products** section
- **Recommended Products** — same category items

### 🛒 Cart (`/cart`)
- Full cart with item image, name, size, price
- Increase / Decrease quantity buttons (with stock validation)
- **Move to Wishlist** per item
- Remove item button
- **Price summary:** items price, delivery charge (free over ₹1000), total
- Cart count badge in header (live)

### ❤️ Wishlist (`/wishlist`)
- All wishlisted products with image, name, price
- **Move to Cart** — removes from wishlist and adds to cart
- Remove from wishlist
- Wishlist count badge in header (live)

### 🧾 Checkout (`/checkout`)
- Select or add a delivery address
- Order summary with items and prices
- Price details: items total, delivery, grand total
- **Place Order** button — COD (Cash on Delivery)
- Cart cleared automatically after successful order

### 👤 Profile (`/profile`)
- **User Info:** name, email, phone (from localStorage)
- **Saved Addresses:** add, edit, delete, set default address
- **Order History:** all past orders with order ID, date, total, delivery status, and items list

### 🔐 Authentication
- **Register** (`/register`) — name, email, password, confirm password
- **Login** (`/login`) — email and password
- JWT token stored in `localStorage` and sent with every API request via Axios interceptor
- Session ID auto-generated for guest cart, wishlist, and address tracking

---

## 📁 Project Structure

```
ecommerce-frontend-main/
├── public/
│   ├── hero-banner.png
│   └── favicon assets
├── src/
│   ├── api/
│   │   └── apiService.js          # Axios instance + session ID + auth token interceptor
│   ├── components/
│   │   ├── common/
│   │   │   ├── AlertMessage.jsx   # Global toast notification banner
│   │   │   └── Loader.jsx         # Spinner loader
│   │   ├── layout/
│   │   │   ├── Header.jsx         # Sticky navbar with search, cart & wishlist badges
│   │   │   └── Footer.jsx         # ShopEase footer with quick links & contact
│   │   ├── product/
│   │   │   └── ProductCard.jsx    # Reusable product card with wishlist + add to cart
│   │   └── profile/
│   │       ├── AddressList.jsx    # Saved addresses with add/edit/delete modal
│   │       ├── OrderHistory.jsx   # Past orders list
│   │       └── UserInfo.jsx       # User name, email, phone display
│   ├── context/
│   │   ├── AlertContext.jsx       # Global alert/toast context (3s auto-dismiss)
│   │   ├── CartContext.jsx        # Cart state, add/remove/update/clear + localStorage sync
│   │   └── WishlistContext.jsx    # Wishlist state, add/remove/check
│   ├── pages/
│   │   ├── Home.jsx               # Category strip + hero banner + promo cards
│   │   ├── ProductList.jsx        # Product grid with filters + URL sync
│   │   ├── ProductDetails.jsx     # Full product view + recommendations
│   │   ├── Cart.jsx               # Cart management + price summary
│   │   ├── Wishlist.jsx           # Wishlist management
│   │   ├── Checkout.jsx           # Address selection + order placement
│   │   ├── Profile.jsx            # User info + addresses + order history
│   │   ├── Login.jsx              # JWT login form
│   │   └── Register.jsx           # Registration form with confirm password
│   ├── App.jsx                    # Routes definition
│   ├── main.jsx                   # App entry point with all providers
│   └── index.css                  # Global styles
├── index.html
├── vite.config.js                 # Vite + API proxy config
├── vercel.json                    # SPA rewrite rules
└── package.json
```

---

## 🗺️ Routes

| Path             | Page           | Description                               |
|------------------|----------------|-------------------------------------------|
| `/`              | Home           | Category cards + hero banner              |
| `/products`      | ProductList    | Filtered and sorted product grid          |
| `/product/:id`   | ProductDetails | Full product info + recommendations       |
| `/cart`          | Cart           | Cart items + price summary                |
| `/wishlist`      | Wishlist       | Saved wishlist items                      |
| `/checkout`      | Checkout       | Address + order placement                 |
| `/profile`       | Profile        | User info, addresses, order history       |
| `/login`         | Login          | Email + password login                    |
| `/register`      | Register       | New user registration                     |

---

## 🔧 Context & State Management

| Context          | Provides                                                   |
|------------------|------------------------------------------------------------|
| `AlertContext`   | `showAlert(message, variant)` — global 3s toast            |
| `CartContext`    | `cart`, `addToCart`, `updateQty`, `removeFromCart`, `clearCart`, `getCartCount`, `getTotalPrice` |
| `WishlistContext`| `wishlist`, `addToWishlist`, `removeFromWishlist`, `isInWishlist` |

Cart is **persisted to `localStorage`** and synced with the backend on every action. Session ID is auto-generated and stored in `localStorage` for guest user tracking.

---

## 🚀 Available Scripts

| Script            | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start development server (Vite)    |
| `npm run build`   | Build for production               |
| `npm run preview` | Preview production build           |
| `npm run lint`    | Run ESLint                         |

---

## 🚀 Deployment (Vercel)

Configured for Vercel with SPA client-side routing rewrites in `vercel.json`.

```bash
npm install -g vercel
vercel
```

---

## 📹 Demo Video

Watch a full walkthrough of all major features: [Loom Video Link](#)

---

## 📬 Contact

For bugs or feature requests, please reach out at: `brundadr315@gmail.com`
