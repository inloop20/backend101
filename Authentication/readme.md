# Authentication System

This module implements a **JWT-based authentication system** built with **Node.js, Express, and Prisma**.  
It demonstrates common backend authentication patterns such as **access tokens, refresh tokens, token rotation, and multi-device session handling**.

---

# Features

- User registration
- User login
- JWT **Access Token + Refresh Token** authentication
- **Refresh token rotation**
- **Multi-device session support**
- Logout from current device
- Logout from all devices
- Get current authenticated user
- Secure password hashing with **bcrypt**
- Centralized error handling

---

# API Routes

| Method | Route | Description |
|------|------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate user and generate tokens |
| POST | `/logout` | Logout current device |
| POST | `/logout-all` | Logout from all active sessions |
| POST | `/refresh` | Generate new access token using refresh token |
| GET | `/me` | Get current authenticated user |

---

# Request & Response Examples

## Register

### Request

```json
POST /api/v1/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
} 
```
### Response
```json
{
  "statusCode": 201,
  "message": "user created successfully",
  "data": {
    "username": "john",
    "email": "john@example.com"
  }
}
```
## Login

### Request
```json
POST /api/v1/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "statusCode": 200,
  "message": "logged in successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "john"
    },
    "accessToken": "jwt_access_token"
  }
}
```

## Refresh Token

### Request

```json
POST /api/v1/refresh
Cookie: refreshToken=your_refresh_token
```
### Response
```json
{
  "statusCode": 200,
  "message": "token refreshed",
  "data": {
    "accessToken": "new_access_token"
  }
}
```

## Get Current User

### Request

```json
GET /me
Authorization: Bearer access_token
```

### Response
```json
{
  "statusCode": 200,
  "message": "user fetched successfully",
  "data": {
    "id": "user_id",
    "username": "john",
    "email": "john@example.com"
  }
}
```

## Logout

### Request

```json
POST /logout
Cookie: refreshToken=your_refresh_token
```

### Response
```json
{
  "statusCode": 200,
  "message": "logout successful"
}
```

## Logout From All Devices

### Request
```json
POST /logout-all
Authorization: Bearer access_token
```

### Response

```json
{
  "statusCode": 200,
  "message": "logout-all successful"
}
```

# Local Setup Guide

Follow these steps to run the authentication module locally.

## 1. Clone the Repository

```bash
git clone https://github.com/inloop20/backend101.git
cd backend101/Authentication
```
## 2. Install Dependencies
```bash
npm install
```

## 3. Setup Environment Variables
```bash
cp .env.example .env
```

## 4. Setup Database

# Run Prisma migrations to create database tables.
```bash
npx prisma migrate dev
```
# Generate Prisma client.
```bash
npx prisma generate
```

## 5. Start the Server
```bash
npm run dev
```
# Server should start on:
```bash
http://localhost:3000
```

# Folder Structure

```text
Authentication/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── controllers/
│   │   └── auth.controller.js
│   │
│   ├── routes/
│   │   └── auth.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   │
│   ├── config/
│   │   └── db.config.js
│   │
│   └── app.js
│
├── .env.example
├── package.json
└── README.md
```
---
# Authentication Flow

1. User registers or logs in.

2. Server generates:
   - **Access Token** (short-lived)
   - **Refresh Token** (stored in an HTTP-only cookie)

3. Access token is used to authenticate API requests.

4. When the access token expires:
   - Client calls `/refresh`
   - Server verifies the refresh token
   - New access token and refresh token are issued

5. Logout removes the refresh token from the database.

---

# Middleware

This module uses structured middleware to keep the code clean and maintainable.

## Auth Middleware
Verifies access tokens and protects private routes.

## Validation Middleware
Ensures request data matches expected schema.

## Error Middleware
Handles errors in a centralized way.

---

# Utilities

Reusable utilities used across the authentication module:

## ApiError
Standardized error handling.

## ApiResponse
Consistent API response format.

## asyncHandler
Wrapper to handle async route errors.

---

# Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt

---

# Security Practices

- Passwords are hashed using **bcrypt**
- Refresh tokens are stored in the **database**
- Refresh tokens are sent via **httpOnly cookies**
- **Token rotation** helps reduce token replay attacks
- **Access tokens** are short-lived

---

# Learning Goals

This module is designed to help understand:

- JWT authentication
- Refresh token strategies
- Session management across devices
- Secure API architecture
- Error handling patterns in Express

---