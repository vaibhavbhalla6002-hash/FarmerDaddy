# FarmerDaddy Backend - User Authentication

## Prerequisites
- MongoDB Atlas account (for `MONGO_URI`)
- Firebase Account (for `FIREBASE_SERVICE_ACCOUNT` and Frontend `firebase-config.js`)
- Node.js installed

## Setup
1. CD into the `backend` folder.
2. Complete the `.env` file with your credentials.
3. Run `npm start` (or `node server.js`) to launch the server.

## Endpoints
- `POST /api/auth/signup`: Simple email/password signup.
- `POST /api/auth/login`: Simple email/password login.
- `POST /api/auth/google`: Google login using Firebase `idToken`.
- `GET /api/auth/logout`: Basic logout helper.

## Frontend
1. Add your Firebase Web App credentials to `src/firebase-config.js`.
2. Use the provided `Login.jsx` and `Signup.jsx` components.
