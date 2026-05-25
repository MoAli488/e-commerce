# E-Commerce Backend API

A robust and scalable e-commerce backend API built with **Node.js, Express, TypeScript, and PostgreSQL**. This project serves as the foundational backend for an e-commerce platform, providing essential features like user authentication, product management, and secure image uploads.

> **Note:** This project is currently **under active development** and is not yet 100% complete. Features are continuously being added and refined.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Payments:** Stripe API
- **Image Storage:** Cloudinary & Multer
- **Validation:** express-validator
- **Testing:** Mocha & Chai

## 🌟 Key Features (Implemented)

- **User Authentication & Authorization**
  - Secure user registration and login.
  - Password hashing using bcrypt.
  - JWT-based authentication.
- **Product Management (CRUD)**
  - Create, read, update, and delete products.
  - Image upload integration with Cloudinary.
  - Categorization of products.
  - Pagination, search by name, and category/price filtering for efficient browsing.
- **Cart & Order Management**
  - Add products to cart and manage quantities.
  - Convert carts to orders.
- **Payment Integration**
  - Secure checkout process using Stripe.
- **Data Validation & Security**
  - Comprehensive request body validation using `express-validator`.
  - Escaping and sanitization of user inputs.
- **Database Integration**
  - Relational database schema designed with Sequelize ORM.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running
- Cloudinary account for image hosting

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd e-commerce
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the necessary variables:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Build and Run:**

   ```bash
   # Development mode with hot-reloading
   npm run dev

   # Build for production
   npm run build

   # Start production server
   npm run start
   ```

## 🧪 Testing

To run the automated test suite using Mocha & Chai:

```bash
npm run test
```

## 📝 API Endpoints Overview

### Authentication (`/auth`)

- `PUT /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate user and receive token
- `DELETE /auth/delete/:userId` - Delete a user account

### Shop/Products (`/`)

- `GET /` - Get home page data
- `GET /products` - Retrieve all products (supports pagination, search, category & price filtering)
- `GET /product/:prodId` - Retrieve a specific product
- `POST /product` - Create a new product (Requires Image Upload)
- `PUT /product/:prodId` - Update an existing product
- `DELETE /product/:prodId` - Delete a product

### Cart & Orders (`/`)

- `GET /cart` - Get user's cart
- `POST /cart/:prodId` - Add a product to cart
- `DELETE /cart/:prodId` - Remove a product from cart
- `POST /checkout` - Create a Stripe checkout session
- `GET /order` - Process successful checkout to create an order
- `GET /orders` - Retrieve all user's orders

---

_Designed and developed by [Mohamed Ali]_
