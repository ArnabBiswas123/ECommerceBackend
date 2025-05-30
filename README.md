# Backend API Server

A Node.js backend application with MongoDB, authentication, payment processing, and file upload capabilities.

## 🚀 Features

- **Authentication & Authorization**: JWT-based user authentication
- **Database**: MongoDB with Mongoose ODM
- **Payment Processing**: Stripe integration for secure payments
- **File Upload**: Cloudinary integration for image/file management
- **RESTful API**: Well-structured API endpoints
- **Middleware**: Custom middleware for token validation
- **Webhook Support**: Stripe webhook handling

## 📁 Project Structure

```
backend/
├── controllers/           # Request handlers
│   ├── login.js          # Authentication controller
│   ├── product.js        # Product management
│   ├── signup.js         # User registration
│   ├── stripePayment.js  # Payment processing
│   └── stripeWebhookController.js # Webhook handlers
├── db/
│   └── connect.js        # Database connection
├── middleware/
│   └── tokenUser.js      # JWT middleware
├── model/                # Database schemas
│   ├── Order.js          # Order model
│   ├── Product.js        # Product model
│   └── User.js           # User model
├── routes/
│   └── userRouter.js     # API routes
├── .env                  # Environment variables
├── app.js               # Main application file
├── package.json         # Dependencies
└── package-lock.json    # Lock file
```

## ✅ Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Stripe account
- Cloudinary account

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory with the following variables:

## 🔧 Environment Variables

Create a `.env` file in your project root and add the following variables:

### Database Configuration
```env
MONGO_URI=mongodb+srv://username:password@cluster0.ub9s54t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Authentication
```env
JWT_SECRET=your-super-secret-jwt-key
```

### Cloudinary (File Upload)
```env
cloud_name=your-cloudinary-cloud-name
api_key=your-cloudinary-api-key
api_secret=your-cloudinary-api-secret
```

### Stripe (Payment Processing)
```env
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
```

### Frontend Configuration
```env
FRONTEND_URL=http://localhost:5173
```

## 🔑 How to Generate Environment Variables

### 1. MongoDB URI
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create an account and set up a cluster
3. Go to **Database Access** → **Add Database User**
4. Go to **Network Access** → **Add IP Address** (0.0.0.0/0 for development)
5. Click **"Connect"** → **"Connect your application"**
6. Copy the connection string and replace `<password>` with your user password

### 2. JWT Secret
Generate a secure random string:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### 3. Cloudinary Credentials
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to **Dashboard**
3. Copy **Cloud Name**, **API Key**, and **API Secret** from the dashboard

### 4. Stripe Secret Key
1. Create account at [Stripe](https://stripe.com/)
2. Go to **Developers** → **API Keys**
3. Copy the **Secret Key** (starts with `sk_test_` for test mode)

### 5. Frontend URL
Set this to your frontend application URL (typically `http://localhost:3000` or `http://localhost:5173` for Vite)

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the configured port (usually 3000 or 8000).

## 📋 API Endpoints

All endpoints are prefixed with `/api/v1/route`

### 🔐 Authentication
- `POST /api/v1/route/signup` - User registration
- `POST /api/v1/route/login` - User login

### 📦 Products
- `POST /api/v1/route/addnewproduct` - Create new product (Protected, requires file upload)
- `PUT /api/v1/route/updateproduct/:id` - Update product (Protected, supports file upload)
- `DELETE /api/v1/route/deleteproduct/:id` - Delete product (Protected)
- `GET /api/v1/route/getallproduct` - Get all products (Protected)
- `GET /api/v1/route/getallproducts` - Get all products (Public access)

### 💳 Payments
- `POST /api/v1/route/create-checkout-session` - Create Stripe checkout session
- `POST /api/v1/route/webhook` - Stripe webhook handler (Raw body parser)

## 🔒 Security Features

- JWT token authentication
- Password hashing
- CORS protection
- Environment variable protection
- Stripe webhook signature verification
  
### Common Issues

#### 1. Database Connection Failed
- Check `MONGO_URI` format
- Verify network access in MongoDB Atlas
- Ensure correct username/password

#### 2. JWT Token Issues
- Verify `JWT_SECRET` is set
- Check token expiration
- Ensure proper token format in requests

#### 3. Stripe Payment Failures
- Verify `STRIPE_SECRET_KEY`
- Check webhook endpoint configuration
- Test with Stripe test cards

#### 4. File Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper file formats
