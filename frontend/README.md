# 💎 Astrra Frontend — Luxury Web Experience

A high-performance React application crafted with Vite and Tailwind CSS for the **Astrra** fine jewellery platform. Features luxury Indian gold & diamond aesthetics, smooth interactive drawers, real-time catalogue search, and multi-step checkout modals.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your backend API URL in `.env`:
```env
# Local backend server
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```
The app will be running at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Production assets will be output to the `dist/` directory.

---

## 🎨 Design System & Architecture

- **Color Palette**: Royal Indian gold (`#C59733`, `#AA771C`), warm champagne backgrounds (`#FAF8F5`, `#F5ECE1`), and rich charcoal text (`#1C1917`).
- **Typography**: `Cinzel` (Heritage Serif headings) and `Plus Jakarta Sans` / `Outfit` (Modern luxury sans-serif body).
- **Icons**: [Lucide React](https://lucide.dev) icons tailored for e-commerce, security certifications, and trust badges.
- **Animations**: Subtle spring micro-animations powered by [Framer Motion](https://www.framer.com/motion/).

---

## 📂 Component Structure

```text
src/
├── assets/                  # Static media, SVG icons, and graphics
├── components/
│   ├── Navbar.jsx           # Sticky luxury header, live rates ticker & search
│   ├── Hero.jsx             # Royal bridal banner with CTA & trust metrics
│   ├── ProductCard.jsx      # Interactive product tile with quick-add & details trigger
│   ├── ProductDetailModal.jsx # Full-screen modal with karat info & consultation
│   ├── CartDrawer.jsx       # Slide-out shopping bag with real-time total calculation
│   ├── CheckoutModal.jsx    # Multi-step checkout with address & payment confirmation
│   ├── TrustBar.jsx         # BIS Hallmark 916, IGI/GIA certification guarantees
│   ├── ReviewsSection.jsx   # Verified bride & client testimonial cards
│   └── Toast.jsx            # Animated notification toasts
├── context/
│   └── CartContext.jsx      # Global cart state, localStorage sync & drawer controls
├── utils/
│   └── formatters.js        # Indian Rupee (INR ₹) currency formatters
├── App.jsx                  # Main application orchestrator & section layout
├── index.css                # Tailwind directives & luxury design tokens
└── main.jsx                 # React root entry point
```

---

## 🌐 Production Deployment (Vercel / Netlify)

1. Set the **Root Directory** to `frontend`.
2. Set the **Build Command** to `npm run build`.
3. Set the **Output Directory** to `dist`.
4. Configure the **Environment Variable**:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-backend.onrender.com`).
5. A `vercel.json` file is already included to ensure single-page application (SPA) routing works smoothly without 404 errors on page refresh.
