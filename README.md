# 🛍️ Clothes Marketplace

A modern and responsive clothes marketplace built with **Next.js**, designed for seamless browsing, buying, and managing fashion products.

---

## 📂 Table of Contents

- [🚀 Getting Started](#-getting-started)
- [📦 Installation](#-installation)
- [💻 Running Locally](#-running-locally)
- [🛠️ Build for Production](#️-build-for-production)
- [📘 Swagger API Docs](#-swagger-api-docs)
- [🔧 Git Workflow](#-git-workflow)
- [📄 License](#-license)

---

## 🚀 Getting Started

This project uses **Next.js** for frontend and API routes. Make sure you have **Node.js (v16 or later)** installed.

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/clothes-marketplace.git
cd clothes-marketplace
npm install
```

## 💻 Running Locally
Start the development server:



```bash
npm run dev
```
Then, navigate to http://localhost:3000 in your browser.

## 🛠️ Build for Production
To build the project for production:

```bash
npm run build
npm start
```
This will compile and start the production server on http://localhost:3000.

## 📘 Swagger API Docs
If you're using Swagger for API documentation:

Make sure your Swagger config file (e.g., swagger.json or swagger.yaml) is available in the public or docs directory.

Use a tool like Swagger UI Express or Redoc to serve it.

Example setup with Swagger UI (in pages/api/swagger.js):


```js
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../docs/swagger.json';

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
```
Then access the documentation at:


http://localhost:3000/api-docs
## 🔧 Git Workflow
#### Basic Git setup for collaboration:

```git
# Create a new feature branch
git checkout -b feature/your-feature-name

# Add your changes
git add .

# Commit your changes
git commit -m "feat: Add your message here"

# Push to GitHub
git push origin feature/your-feature-name

# Create a Pull Request and request review

#Always pull from the master branch before starting new work:
git checkout master
git pull origin master
```

## Flow of Website

```
[Landing Page (/)]
    └── View Products → [Product Listing (/shop)]
                          └── Click Product → [Product Detail (/product/[id])]
                                                └── Add to Cart → [Cart (/cart)]
                                                                      └── Checkout → [Login/Register (/login or /register)]
                                                                                      └── Auth Success → [Checkout Page (/checkout/success)]
                                                                                

[Navigation Bar (persistent)]
    ├── Home (/)
    ├── Shop (/shop)
    ├── Cart (/cart)
    ├── Orders (/orders) — (only after login)
    ├── Profile (/profile) — (only after login)
    └── Admin Panel (/admin) — (admin role only)

[Authentication]
    ├── Register (/register)
    └── Login (/login)
          └── Redirect based on role:
               ├── Regular User → Shop (/shop)
               └── Admin → Admin Panel (/admin)

[Admin Panel (/admin)] — (admin role only)
    ├── Overview (/admin)
    ├── Customers (/admin?selectedTab?customers)
    ├── Orders (/admin?selectedTab?orders) 
    ├── Products Management (/admin?selectedTab?products)
    └── Billing (/admin?selectedTab=billing)
```