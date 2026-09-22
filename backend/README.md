# Product & Stock Management Backend API

A professional, enterprise-ready **Product & Stock Management RESTful API** built with the MERN backend stack (**Node.js**, **Express.js**, **MongoDB**, **Mongoose**).

This backend is designed for businesses needing accurate stock tracking, product lifecycle management, batch origin recording, real-time stock valuation, and complete audit history for inventory movements.

---

## 🚀 Key Features

1. **User Authentication & Authorization**:
   - Secure JWT token authentication.
   - Password hashing with `bcryptjs`.
   - Role-based access control (`admin` and `user`).
   - Protected user profile endpoint (`/api/auth/me`).

2. **Product Management**:
   - Unique product references (`PRD-001`).
   - Barcode support for fast barcode scanner integration (`/api/products/barcode/:barcode`).
   - Soft deletion / deactivation (`isActive` flag) preserving historical data.
   - Search, filter (by category, origin, low stock), sort, and pagination support.
   - Dynamic calculation of stock status (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`).

3. **Stock Engine & Movement History**:
   - **Origin/Country Tracking**: Track stock batches arriving from different countries (e.g. France, Italy, USA, Germany, Tunisia).
   - **ENTRY (`POST /api/stock/entry`)**: Increment product quantity atomically and record batch origin, unit price, and total value.
   - **EXIT (`POST /api/stock/exit`)**: Decrement product quantity with strict validation against stock overdrafts.
   - **Insufficient Stock Guard**: Returns `400 Bad Request` with `{ "success": false, "message": "Insufficient stock" }` if exit quantity exceeds available stock.
   - **Immutable History**: Historical stock movements cannot be edited directly; audit integrity is preserved via correction entries.
   - **Atomic Transactions**: Database transactions (with fallback) ensure product quantity updates and movement records succeed together or roll back entirely.

4. **Dashboard & Analytics**:
   - Overall product count (Total & Active).
   - Total inventory quantity.
   - Low-stock and out-of-stock product alerts.
   - Real-time stock value calculation (`Current Quantity × Product Price`).
   - Today's entry and exit activity metrics.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, Express Rate Limit, JWT, BcryptJS
- **Validation**: Express-Validator
- **Testing**: Jest, Supertest, MongoDB Memory Server

---

## 📂 Project Architecture

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js             # Mongoose connection logic
│   │   └── env.js            # Centralized environment variable loader
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── stockController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect & role authorization
│   │   ├── errorMiddleware.js     # Centralized error handler
│   │   └── validateMiddleware.js  # Express-validator result parser
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── StockMovement.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── stockRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── stockService.js
│   │   └── dashboardService.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── pagination.js
│   │   ├── response.js
│   │   └── seed.js           # Database seed script
│   ├── app.js                # Express app setup & middleware wiring
│   └── server.js             # Server listener & database bootstrap
├── tests/
│   ├── setup.js              # Test suite database runner
│   ├── auth.test.js
│   ├── product.test.js
│   └── stock.test.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/product_stock_db
JWT_SECRET=super_secret_jwt_key_product_stock_2026
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 📥 Installation & Running

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Database Seed (Optional)
Populates MongoDB with sample admin user, standard user, products, and movements:
```bash
node src/utils/seed.js
```

### 3. Run in Development Mode
```bash
npm run dev
```

### 4. Run in Production Mode
```bash
npm start
```

### 5. Run Automated Tests
```bash
npm test
```

---

## 🌐 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT |
| `GET` | `/api/auth/me` | Private | Get current authenticated user |

#### Register Payload:
```json
{
  "name": "Admin Boss",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

#### Login Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "60d5ec49f1b2c80015f8e4a1",
      "name": "Admin Boss",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

---

### 📦 Products (`/api/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/products` | Private | Create product (quantity starts at 0) |
| `GET` | `/api/products` | Private | List products (filterable & paginated) |
| `GET` | `/api/products/:id` | Private | Get product details + stock status |
| `PUT` | `/api/products/:id` | Private | Update metadata (ignores direct quantity changes) |
| `PATCH` | `/api/products/:id/deactivate` | Admin | Soft delete / deactivate product |
| `PATCH` | `/api/products/:id/activate` | Admin | Reactivate product |
| `GET` | `/api/products/barcode/:barcode` | Private | Lookup product by barcode scanner |
| `GET` | `/api/products/:id/movements` | Private | Get chronological stock history for product |

#### Create Product Request:
```json
{
  "reference": "PRD-001",
  "name": "Chaise de bureau",
  "price": 180,
  "defaultOrigin": "France",
  "category": "Furniture",
  "minimumStock": 5,
  "barcode": "6191234567890"
}
```

#### Query Parameters (`GET /api/products`):
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `search` (searches reference, name, barcode, category, defaultOrigin)
- `category`
- `origin`
- `lowStock` (`true`/`false`)
- `isActive` (`true`/`false`)
- `sortBy` (`name`, `reference`, `price`, `quantity`, `createdAt`)
- `sortOrder` (`asc`/`desc`)

---

### 📊 Stock Movements (`/api/stock`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/stock/entry` | Private | Add stock (type: `ENTRY`) |
| `POST` | `/api/stock/exit` | Private | Remove stock (type: `EXIT`) |
| `GET` | `/api/stock` | Private | Get all stock movements |
| `GET` | `/api/stock/:id` | Private | Get single stock movement detail |

#### Stock Entry Request:
```json
{
  "productId": "60d5ec49f1b2c80015f8e4a2",
  "quantity": 20,
  "origin": "France",
  "unitPrice": 150,
  "note": "New shipment received from supplier"
}
```

#### Stock Exit Request:
```json
{
  "productId": "60d5ec49f1b2c80015f8e4a2",
  "quantity": 5,
  "unitPrice": 180,
  "note": "Customer order #1042"
}
```

---

### 📈 Dashboard (`/api/dashboard`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Private | Fetch real-time stock dashboard statistics |

#### Response Example:
```json
{
  "success": true,
  "message": "Dashboard statistics fetched successfully",
  "data": {
    "totalProducts": 125,
    "activeProducts": 120,
    "totalQuantity": 2450,
    "lowStockProducts": 8,
    "outOfStockProducts": 3,
    "totalStockValue": 125000,
    "todayEntries": 1500,
    "todayExits": 800
  }
}
```

---

## 📐 Business & Security Rules

1. **Unique References**: Product reference codes are converted to uppercase and must be unique.
2. **Strict Quantity Control**: Product quantity starts at 0 upon creation. `PUT /api/products/:id` does NOT allow direct quantity alteration. All quantity changes MUST occur via stock entry or exit endpoints.
3. **Batch Origin Preservation**: Origins are recorded per movement so the same product can have stock batches arriving from France, Italy, USA, Germany, etc.
4. **Historical Price Preservation**: Stock movements preserve the exact `unitPrice` and calculate `totalValue` at the moment of transaction.
5. **No Stock Overdrafts**: `EXIT` requests are validated against current stock. If `quantity > product.quantity`, the backend rejects the request with HTTP `400 Bad Request`.
6. **Data Auditability**: Movements cannot be updated or deleted. Corrections are handled via new stock movements with explanatory notes.
7. **Database Transactions**: Operations update `StockMovement` and `Product.quantity` inside a session transaction to prevent data desynchronization.

---

## 🧪 Testing

Run the integration test suite:

```bash
npm test
```

The test suite automatically sets up an isolated in-memory MongoDB server (`mongodb-memory-server`) and tests authentication, product lifecycle, stock movements, origin tracking, insufficient stock errors, stock mathematical operations (`100 + 20 - 30 + 10 = 100`), and dashboard metrics calculations.
