# Lumé — E-Commerce Site

A modern, responsive e-commerce site built with React + Vite + Tailwind CSS.

## Pages
- **Home** — Hero, stats, featured products, newsletter banner
- **Shop** — Full product grid with search, category filter, and sorting
- **Cart** — Cart items with quantity controls and order summary
- **Contact** — Contact info and message form

## Tech Stack
- React 18
- React Router v6
- Vite
- Tailwind CSS v3

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Sticky nav with mobile menu + cart count
│   ├── Footer.jsx        # Site footer with links
│   └── ProductCard.jsx   # Reusable product card
├── context/
│   └── CartContext.jsx   # Global cart state (add, remove, update qty)
├── data/
│   └── products.js       # Product list + categories
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── Cart.jsx
│   └── Contact.jsx
├── App.jsx               # Routes setup
├── main.jsx              # Entry point
└── index.css             # Tailwind base
```
