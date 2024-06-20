# Order Management System

## Overview

This repository contains the implementation of an Order Management System (OMS) for an e-commerce mobile app. The application is built using NestJS as the backend framework, Prisma as the ORM, and PostgreSQL as the database.

## Features

- **Add to Cart**: Adds a product to the user's cart or updates the quantity if the product is already in the cart.
- **View Cart**: Retrieves the user's cart.
- **Update Cart**: Updates the quantity of a product in the cart.
- **Remove From Cart**: Removes a product from the cart.
- **Create Order**: Creates a new order for the specified user with the products in their cart.
- **Get Order by ID**: Retrieves the order details by order ID.
- **Update Order Status**: Updates the status of an order.
- **Apply Coupon**: Applies a discount coupon to an order.
- **Order History Retrieval**: Retrieves the order history for a user.

## Environment Setup

### Prerequisites

- Node.js (v14 or above)
- npm (v6 or above)
- PostgreSQL (v12 or above)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/mohanad-80/order-management-system.git
   cd order-management-system
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Setup PostgreSQL Database:**
   - Ensure PostgreSQL is running.
   - Create a database named `oms_db`.

4. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```
     DATABASE_URL="postgresql://<username>:<password>@localhost:5432/oms_db"
     ```

5. **Run Prisma migrations:**
   ```sh
   npx prisma migrate dev
   ```

6. **Generate Prisma client:**
   ```sh
   npx prisma generate
   ```

### Running the Application

1. **Start the application:**
   ```sh
   npm run start:dev
   ```

2. **Access the application:**
   - The server will start on `http://localhost:3000`.

### API Documentation

- Swagger documentation is available at `http://localhost:3000/api`.

### Testing

  - End-to-End Test
  
    ```sh
      npm run test:e2e
    ```

## API Endpoints

### Cart

- **Add to Cart**
  - **Endpoint**: POST `/api/cart/add`
  - **Body**:
    ```json
    {
      "userId": 1,
      "productId": 2,
      "quantity": 3
    }
    ```

- **View Cart**
  - **Endpoint**: GET `/api/cart/:userId`

- **Update Cart**
  - **Endpoint**: PUT `/api/cart/update`
  - **Body**:
    ```json
    {
      "userId": 1,
      "productId": 2,
      "quantity": 5
    }
    ```

- **Remove From Cart**
  - **Endpoint**: DELETE `/api/cart/remove`
  - **Body**:
    ```json
    {
      "userId": 1,
      "productId": 2
    }
    ```

### Orders

- **Create Order**
  - **Endpoint**: POST `/api/orders`
  - **Body**:
    ```json
    {
      "userId": 1
    }
    ```

- **Get Order by ID**
  - **Endpoint**: GET `/api/orders/:orderId`

- **Update Order Status**
  - **Endpoint**: PUT `/api/orders/:orderId/status`
  - **Body**:
    ```json
    {
      "status": "shipped"
    }
    ```

- **Apply Coupon**
  - **Endpoint**: POST `/api/orders/apply-coupon`
  - **Body**:
    ```json
    {
      "orderId": 1,
      "coupon": "DISCOUNT10"
    }
    ```

- **Order History Retrieval**
  - **Endpoint**: GET `/api/users/:userId/orders`

### Users

- **Retrieve user's orders history**
  - **Endpoint**: GET `/api/users/:userId/orders`