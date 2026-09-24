# Product Admin Dashboard

A modern, responsive, and professional **Product Admin Dashboard** built with **Next.js, React, TypeScript, Tailwind CSS, and Axios**.

This application provides an admin-style interface for managing a product catalog through the **DummyJSON REST API**. It includes product listing, search, category filtering, pagination, product details, product creation, product editing, and product deletion.

The project was developed as a **frontend development / full-stack assessment project** with a focus on clean UI, responsive design, reusable API services, type safety, and proper user interaction handling.

---

## 🚀 Live Project

### GitHub Repository

https://github.com/sahil8669/product-admin-dashboard

---

## 📌 Project Overview

The **Product Admin Dashboard** allows administrators to manage products from a centralized dashboard.

The application provides:

* Product catalog management
* Product search
* Category filtering
* Pagination
* Product details
* Product creation
* Product editing
* Product deletion
* Inventory status
* Pricing and discount information
* Product ratings
* Responsive admin sidebar
* Mobile-friendly interface
* Loading states
* Error handling
* Success notifications
* Delete confirmation modal

The application communicates with the DummyJSON REST API using a centralized Axios configuration and a dedicated service layer.

---

# ✨ Features

## 📊 Dashboard

The main dashboard provides an overview of the product catalog.

It includes:

* Total product count
* Current-page stock information
* Out-of-stock products
* Available categories
* Product table
* Search functionality
* Category filtering
* Pagination

---

## 🔍 Product Search

Users can search for products by name.

The search functionality uses the DummyJSON search endpoint and dynamically updates the product list.

Example:

```text
Search → "phone"
```

The dashboard then displays matching products.

---

## 🏷️ Category Filtering

Products can be filtered by category using the category dropdown.

Available categories are fetched dynamically from the API.

Users can also clear the active filters using the **Clear Filters** button.

---

## 📄 Pagination

Products are loaded page-by-page instead of loading the complete catalog at once.

The dashboard uses:

```text
limit = 12
```

and calculates the API offset using:

```text
skip = (page - 1) × 12
```

Users can navigate using:

* Previous
* Next

---

## 👁️ Product Details

Each product contains a **View** action that opens a dedicated product details page.

The details page displays:

* Product image gallery
* Product title
* Description
* Brand
* Category
* Price
* Discount
* Discounted price
* Rating
* Stock
* Availability status
* SKU
* Weight
* Dimensions
* Shipping information
* Warranty information
* Return policy
* Minimum order quantity
* Product reviews
* Product metadata

---

## ➕ Add Product

Administrators can create a new product through the **Add Product** page.

The form includes:

* Product title
* Description
* Category
* Brand
* Price
* Discount percentage
* Stock quantity

The form also includes:

* Required field validation
* Loading state
* Success message
* Error message
* Form reset after successful submission

---

## ✏️ Edit Product

Existing products can be edited from the product management interface.

The edit page allows administrators to update:

* Product title
* Description
* Category
* Brand
* Price
* Discount
* Stock

The interface also provides a live discounted-price preview.

---

## 🗑️ Delete Product

Products can be deleted using the **Delete** action.

Before deletion, the dashboard displays a confirmation modal.

The modal asks the administrator to confirm the action before sending the DELETE request.

The UI also provides:

* Delete loading state
* Success notification
* Error handling
* Cancel option

---

# 🎨 Responsive Design

The application is designed to work across different screen sizes.

Supported layouts include:

* 📱 Mobile
* 📱 Large Mobile
* 📟 Tablet
* 💻 Laptop
* 🖥️ Desktop

### Mobile

On smaller screens:

* Desktop sidebar changes into a mobile drawer
* Dashboard cards stack vertically
* Filters become responsive
* Product table supports horizontal scrolling
* Buttons remain accessible
* Delete modal adapts to smaller screens

---

# 🧩 Application Pages

| Page            | Route                 | Description                       |
| --------------- | --------------------- | --------------------------------- |
| Dashboard       | `/`                   | Product management dashboard      |
| Add Product     | `/products/add`       | Create a new product              |
| Product Details | `/products/[id]`      | View complete product information |
| Edit Product    | `/products/edit/[id]` | Update an existing product        |

---

# 🛠️ Tech Stack

## Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **Axios**

## API

* **DummyJSON REST API**

## Development Tools

* **Git**
* **GitHub**
* **ESLint**
* **Visual Studio Code**
* **PowerShell**

---

# 🏗️ Project Architecture

The application follows a simple separation of responsibilities.

```text
UI Components
     ↓
Next.js Pages
     ↓
Product Service Layer
     ↓
Axios API Client
     ↓
DummyJSON REST API
```

### UI Layer

The `app/` directory contains the application's pages and user interface.

### Components

Reusable UI elements are maintained inside:

```text
components/
```

### Services

API-related logic is separated into:

```text
services/
```

This keeps API requests separate from UI logic.

### API Client

The centralized Axios instance is located inside:

```text
lib/axios.ts
```

### Types

TypeScript interfaces are maintained inside:

```text
types/
```

This provides type safety across API responses and application state.

---

# 📁 Project Structure

```text
product-admin-dashboard/
│
├── app/
│   │
│   ├── edit/
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── products/
│   │   │
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   │
│   │   ├── add/
│   │   │   └── page.tsx
│   │   │
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.tsx
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── Sidebar.tsx
│
├── lib/
│   ├── auth.ts
│   └── axios.ts
│
├── services/
│   ├── auth.service.ts
│   └── product.service.ts
│
├── src/
│   └── services/
│       ├── api.js
│       └── productService.js
│
├── types/
│   ├── auth.ts
│   └── product.ts
│
├── public/
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

# 🔌 API Integration

The application uses the DummyJSON REST API.

Base API:

```text
https://dummyjson.com
```

The project uses a centralized Axios instance located at:

```text
lib/axios.ts
```

---

# 📡 Product API Endpoints

## Get Products

```http
GET /products
```

Used to retrieve the product catalog.

---

## Get Product By ID

```http
GET /products/:id
```

Used by the product details and edit pages.

---

## Search Products

```http
GET /products/search?q=:query
```

Used for product search.

---

## Get Products By Category

```http
GET /products/category/:category
```

Used for category filtering.

---

## Get Categories

```http
GET /products/categories
```

Used to dynamically populate the category dropdown.

---

## Create Product

```http
POST /products/add
```

Used by the Add Product page.

---

## Update Product

```http
PUT /products/:id
```

Used by the Edit Product page.

---

## Delete Product

```http
DELETE /products/:id
```

Used by the Delete Product functionality.

---

# 🔄 API Service Layer

Product API operations are centralized inside:

```text
services/product.service.ts
```

The service layer provides functions for:

```text
getProducts()
getProductById()
searchProducts()
getProductsByCategory()
getCategories()
createProduct()
updateProduct()
deleteProduct()
```

This keeps API communication separate from the UI components.

---

# 🔐 Axios Configuration

The project uses a centralized Axios instance.

Location:

```text
lib/axios.ts
```

The Axios client provides:

* Base URL configuration
* JSON content type
* Request interceptor
* Access token handling
* Response interceptor
* Basic 401 handling

The access token is read from browser `localStorage` when available.

---

# ⚛️ React State Management

The dashboard uses React state hooks such as:

```text
useState()
useEffect()
```

State is used for:

* Products
* Categories
* Search query
* Selected category
* Current page
* Loading state
* Error state
* Success state
* Delete state
* Selected product for deletion

---

# 🛣️ Dynamic Routing

The application uses Next.js App Router dynamic routes.

Example:

```text
/products/[id]
```

If the product ID is:

```text
1
```

the page becomes:

```text
/products/1
```

This allows the same page component to display different products dynamically.

---

# ⏳ Loading States

The application provides loading feedback during API operations.

Loading states include:

* Dashboard skeleton
* Product table skeleton
* Product details skeleton
* Add Product loading state
* Edit Product loading state
* Delete loading state
* Filter updating indicator

This improves the overall user experience while waiting for API responses.

---

# ⚠️ Error Handling

The application handles common API failures and displays user-friendly messages.

Examples include:

```text
Failed to load products.
```

```text
Failed to delete product. Please try again.
```

The application also provides empty states when a search or filter returns no products.

---

# 🧮 Discount Calculation

The product details and edit interfaces calculate the discounted price using:

```text
Discounted Price =
Price - (Price × Discount Percentage / 100)
```

Example:

```text
Price = $100
Discount = 20%

Discounted Price = $80
```

---

# 🧪 Validation

The Add Product and Edit Product forms include client-side validation.

Validation is performed for fields such as:

* Product title
* Description
* Category
* Price
* Stock

The UI prevents invalid submissions and displays appropriate error messages.

---

# 🚀 Getting Started

Follow these steps to run the project locally.

## 1. Clone the Repository

```bash
git clone https://github.com/sahil8669/product-admin-dashboard.git
```

---

## 2. Navigate to the Project

```bash
cd product-admin-dashboard
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Start Development Server

```bash
npm run dev
```

The application will start at:

```text
http://localhost:3000
```

Open the URL in your browser.

---

# 📜 Available Scripts

## Development

```bash
npm run dev
```

Starts the Next.js development server.

---

## Lint

```bash
npm run lint
```

Runs ESLint and checks the project for code-quality issues.

---

## Production Build

```bash
npm run build
```

Creates an optimized production build.

---

## Production Server

```bash
npm run start
```

Starts the production server after creating a production build.

---

# ✅ Project Verification

The project has been verified using:

```bash
npm run lint
```

and:

```bash
npm run build
```

### Lint Result

```text
0 errors
4 warnings
```

The remaining warnings are related to the use of standard HTML `<img>` elements and Next.js image optimization recommendations.

### Build Result

Production build completed successfully.

```text
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

# ⚠️ Important DummyJSON Limitation

This project uses **DummyJSON** as the API backend.

DummyJSON simulates product mutation operations such as:

```text
POST
PUT
DELETE
```

Therefore, product creation, editing, and deletion can be demonstrated successfully through the application UI and API responses, but these mutations are **not permanently persisted on the DummyJSON server**.

For a production-ready application, the frontend could be connected to a persistent backend and database.

Possible backend technologies include:

* Node.js
* Express.js
* Spring Boot
* PostgreSQL
* MySQL
* MongoDB

---

# 🔮 Future Improvements

The following features could be added in a future production version:

* Real authentication
* Role-based authorization
* Persistent database
* Admin user management
* Product image upload
* Product sorting
* Advanced filtering
* Bulk product operations
* Inventory analytics
* Dashboard charts
* Real-time inventory updates
* Toast notification system
* Automated unit testing
* Integration testing
* End-to-end testing
* Production backend
* Cloud deployment

---

# 🎯 Key Learning Outcomes

Through this project, the following concepts were implemented:

* Next.js App Router
* React functional components
* React Hooks
* TypeScript
* REST API integration
* Axios
* CRUD operations
* Dynamic routing
* Search functionality
* Category filtering
* Pagination
* Form validation
* Loading states
* Error handling
* Responsive design
* Tailwind CSS
* Git and GitHub
* Component-based architecture
* Service-layer architecture

---

# 👨‍💻 Author

## Sahil Choudhary

BTech Computer Science Engineering — Artificial Intelligence

GitHub:

https://github.com/sahil8669

---

# 📄 License

This project was developed as a **portfolio and technical assessment project**.

It is intended for educational, demonstration, and portfolio purposes.
