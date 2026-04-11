# 🌾 FarmerDaddy

**FarmerDaddy** is a web application built to empower farmers with smart agricultural tools. It features a **Crop Disease Detector** and is backed by Firebase, giving farmers real-time insights to protect their crops and improve yields.

---

## ✨ Features

- 🔍 **Crop Disease Detector** — Upload or capture images of crops to identify diseases and get actionable recommendations.
- 🔥 **Firebase Integration** — Real-time database, authentication, and cloud storage for a seamless user experience.
- ⚡ **Fast & Responsive UI** — Built with React 19 and Vite for a lightning-fast interface on all devices.

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 19, Vite                    |
| Backend   | Node.js (see `backend_vs/`)       |
| Database  | Firebase (Firestore)              |
| Auth      | Firebase Authentication           |
| HTTP      | Axios                             |
| Icons     | Lucide React                      |
| Linting   | ESLint                            |

---

## 📁 Project Structure

```
FarmerDaddy/
├── backend_vs/          # Backend server (Node.js)
├── public/              # Static assets
├── src/                 # React frontend source
├── Crop Disease Detector # ML model / detection module
├── index.html           # Entry HTML
├── vite.config.js       # Vite configuration
├── package.json         # Project dependencies
└── eslint.config.js     # ESLint rules
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm or yarn
- A Firebase project (for auth & database)

### Installation

```bash
# Clone the repository
git clone https://github.com/vaibhavbhalla6002-hash/FarmerDaddy.git
cd FarmerDaddy

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🔧 Environment Setup

Create a `.env` file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is currently unlicensed.
