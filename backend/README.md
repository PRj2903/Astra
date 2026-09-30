# 💎 Astrra Backend — REST API & Database Service

The core REST API and database orchestration service for the **Astrra** luxury fine jewellery platform. Powered by Node.js, Express, and Supabase (PostgreSQL).

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

Fill in your configuration:
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_or_anon_key
```

### 3. Database Seeding (Optional)
Populate the Supabase `products` table with initial jewellery catalogue items:
```bash
npm run seed
```

### 4. Run the Server
- **Development mode (with auto-reload)**:
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check endpoint |
| `GET` | `/api/products` | Retrieve all products (Supports `?category=` and `?search=`) |
| `GET` | `/api/products/:id` | Retrieve single product details by UUID |
| `POST` | `/api/orders` | Place order (recalculates pricing against DB to prevent tampering) |
| `GET` | `/api/orders/:id` | Retrieve order details and associated line items |

---

## ☁️ Deployment (Render / Railway)

1. Connect your GitHub repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add the environment variables (`PORT`, `SUPABASE_URL`, `SUPABASE_KEY`).
