let admin;
try {
  admin = require('firebase-admin');
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization failed. Google login will be disabled:', error.message);
}

module.exports = admin;
