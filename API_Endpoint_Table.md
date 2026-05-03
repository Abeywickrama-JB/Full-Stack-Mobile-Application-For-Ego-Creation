# EGO Creation Project - API Endpoint Documentation

## 📋 **Authentication**
All protected endpoints require JWT token in `Authorization: Bearer <token>` header.

---

## 🔐 **Auth Endpoints**

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| POST | `/auth/register` | User registration | ❌ | `{name, email, password}` | `{message, role}` |
| POST | `/auth/login` | User login | ❌ | `{identifier, password}` | `{token, user}` |
| POST | `/auth/admin/register` | Admin registration | ❌ | `{name, email, password}` | `{message}` |

---

## 📦 **Product Endpoints**

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| POST | `/products` | Create product | ✅ Admin | `{name, description, price, category, stock}` + image | `Product` |
| GET | `/products` | Get all products | ❌ | - | `Product[]` |
| GET | `/products/:id` | Get single product | ❌ | - | `Product` |
| PUT | `/products/:id` | Update product | ✅ Admin | `{name, description, price, category, stock}` | `Product` |
| DELETE | `/products/:id` | Delete product | ✅ Admin | - | `{message}` |

---

## 🛒 **Order Endpoints**

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| POST | `/orders` | Create order | ✅ User | `{products, totalAmount, paymentMethod, customizationId?}` | `Order` |
| GET | `/orders/myorders` | Get user orders | ✅ User | - | `Order[]` |
| GET | `/orders/all` | Get all orders | ✅ Admin | - | `Order[]` |
| PUT | `/orders/:id/status` | Update order status | ✅ Admin | `{status}` | `Order` |
| PUT | `/orders/:id/cancel` | Cancel order | ✅ User | - | `{message, order}` |
| POST | `/orders/create-from-custom-request` | Create order from custom request | ✅ User | `{customRequestId}` | `Order` |

---

## 🎨 **Customization Endpoints**

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| POST | `/customs` | Create customization | ✅ User | `{productId, personalizedMessage, fontStyle, colorCode, theme}` + image | `Customization` |
| GET | `/customs` | Get all customizations | ✅ Admin | - | `Customization[]` |
| GET | `/customs/mycustomizations` | Get user customizations | ✅ User | - | `Customization[]` |
| PUT | `/customs/admin/:id/approve` | Approve customization | ✅ Admin | `{adjustedPrice?}` | `Customization` |
| PUT | `/customs/admin/:id/reject` | Reject customization | ✅ Admin | `{adminNotes}` | `Customization` |
| PUT | `/customs/admin/:id/price-update` | Request price update | ✅ Admin | `{adjustedPrice, adminNotes}` | `Customization` |

---

## 💡 **Custom Request Endpoints**

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| POST | `/custom-requests` | Create custom request | ✅ User | `{itemName, category, description, budgetMin, budgetMax, urgency, personalMessage, fontStyle, colorCode}` + image | `CustomRequest` |
| GET | `/custom-requests/myrequests` | Get user custom requests | ✅ User | - | `CustomRequest[]` |
| GET | `/custom-requests/admin/all` | Get all custom requests | ✅ Admin | - | `CustomRequest[]` |
| POST | `/custom-requests/admin/create` | Create custom request for customer | ✅ Admin | `{customerEmail, customerName, itemName, category, description, basePrice, urgency, personalMessage, fontStyle, colorCode}` + image | `CustomRequest` |
| PUT | `/custom-requests/admin/:id/quote` | Provide quote for custom request | ✅ Admin | `{quotedPrice, estimatedDays, adminNotes, materials}` | `CustomRequest` |
| PUT | `/custom-requests/:id/respond` | Customer responds to quote | ✅ User | `{customerResponse}` | `{message, request}` |
| PUT | `/custom-requests/admin/:id/status` | Update request status | ✅ Admin | `{status}` | `CustomRequest` |

---

## 🎟️ **Promo Code Endpoints**

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| POST | `/promos` | Create promo code | ✅ Admin | `{code, discountPercentage, expiryDate, minOrderAmount}` | `PromoCode` |
| GET | `/promos` | Get all promo codes | ✅ Admin | - | `PromoCode[]` |
| GET | `/promos/active` | Get active promo codes | ❌ | - | `PromoCode[]` |
| POST | `/promos/validate` | Validate promo code | ❌ | `{code, orderAmount}` | `{valid, discount, message}` |
| PUT | `/promos/:id/toggle` | Toggle promo status | ✅ Admin | - | `PromoCode` |

---

## ⭐ **Review Endpoints**

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| POST | `/reviews` | Create review | ✅ User | `{product, rating, comment}` | `Review` |
| GET | `/reviews` | Get all reviews | ✅ Admin | - | `Review[]` |
| GET | `/reviews/product/:productId` | Get product reviews | ❌ | - | `Review[]` |
| PUT | `/reviews/:id/approve` | Approve review | ✅ Admin | - | `Review` |
| DELETE | `/reviews/:id` | Delete review | ✅ Admin | - | `{message}` |

---

## 📸 **Media Endpoints**

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| POST | `/media/upload` | Upload media file | ✅ User | `{image, category?, title?, description?}` | `{url, media}` |
| GET | `/media/photos/:category` | Get photos by category | ✅ User | - | `Media[]` |
| GET | `/media/categories/stats` | Get category statistics | ✅ User | - | `[{category, count}]` |
| GET | `/media/all` | Get all media | ✅ Admin | - | `Media[]` |
| DELETE | `/media/:id` | Delete media | ✅ Admin | - | `{message}` |

---

## 👥 **User Management Endpoints**

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| GET | `/users` | Get all users | ✅ Admin | - | `User[]` |
| GET | `/admins` | Get all admins | ✅ Admin | - | `User[]` |
| POST | `/users/admin/create` | Create admin user | ✅ Admin | `{name, email, password}` | `{message}` |
| PUT | `/users/:id/role` | Update user role | ✅ Admin | `{role}` | `User` |
| DELETE | `/users/:id` | Delete user | ✅ Admin | - | `{message}` |

---

## 📊 **Data Models**

### **User Model**
```javascript
{
    name: String,
    email: String,
    password: String,
    role: ['user', 'admin']
}
```

### **Product Model**
```javascript
{
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    imageUrl: String
}
```

### **Order Model**
```javascript
{
    user: ObjectId,
    products: [{product: ObjectId, quantity: Number}],
    totalAmount: Number,
    customization: ObjectId,
    paymentMethod: String,
    status: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
}
```

### **Customization Model**
```javascript
{
    user: ObjectId,
    productId: ObjectId,
    order: ObjectId,
    personalizedMessage: String,
    fontStyle: String,
    colorCode: String,
    theme: String,
    customImage: String,
    status: ['Pending', 'Approved', 'Rejected', 'Requires Price Update'],
    adminNotes: String,
    adjustedPrice: Number,
    originalPrice: Number
}
```

### **CustomRequest Model**
```javascript
{
    user: ObjectId,
    itemName: String,
    category: String,
    description: String,
    referenceImage: String,
    budgetMin: Number,
    budgetMax: Number,
    quotedPrice: Number,
    estimatedDays: Number,
    urgency: String,
    personalMessage: String,
    fontStyle: String,
    colorCode: String,
    status: ['Pending', 'Under Review', 'Quoted', 'Approved', 'Rejected', 'In Progress', 'Completed'],
    adminNotes: String,
    customerResponse: ['Pending', 'Accepted', 'Rejected'],
    linkedOrder: ObjectId
}
```

### **PromoCode Model**
```javascript
{
    code: String,
    discountPercentage: Number,
    expiryDate: Date,
    minOrderAmount: Number,
    isActive: Boolean
}
```

### **Review Model**
```javascript
{
    user: ObjectId,
    product: ObjectId,
    rating: Number (1-5),
    comment: String,
    isApproved: Boolean
}
```

### **Media Model**
```javascript
{
    userId: ObjectId,
    fileName: String,
    fileUrl: String,
    fileType: String,
    category: ['Gift Ideas', 'Inspirations', 'Reference Photos', 'Custom Samples', 'General'],
    title: String,
    description: String
}
```

---

## 🔧 **Error Responses**

### **Standard Error Format**
```javascript
{
    message: "Error description",
    error: "Detailed error info" // Optional
}
```

### **Common HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🌐 **Base URL**
```
Development: http://localhost:3000/api
Production: https://your-backend-url.com/api
```

---

## 📝 **Usage Examples**

### **Login**
```javascript
POST /api/auth/login
{
    "identifier": "user@example.com",
    "password": "password123"
}
```

### **Create Product**
```javascript
POST /api/products
Headers: Authorization: Bearer <token>
FormData: 
- name: "Flower Bouquet"
- price: 25.99
- category: "Flowers"
- stock: 50
- image: [file]
```

### **Create Custom Request**
```javascript
POST /api/custom-requests
Headers: Authorization: Bearer <token>
FormData:
- itemName: "Custom Wooden Box"
- category: "Gifts"
- description: "Personalized wooden box with engraving"
- budgetMin: 30
- budgetMax: 50
- urgency: "Normal"
- image: [file]
```

---

## 🚀 **Deployment Notes**

### **Environment Variables Required**
```
PORT=3000
MONGO_URI=mongodb://connection_string
JWT_SECRET=your_secret_key
```

### **File Upload Configuration**
- Max file size: 5MB
- Supported formats: JPG, PNG, WEBP
- Upload destination: `./uploads/`
- Static serving: `/uploads` route

---

*Last Updated: May 2026*
*EGO Creation Platform v2.0*
