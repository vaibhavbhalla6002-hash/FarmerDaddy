const admin = require('firebase-admin');

// Service account details will be needed. For this template, you'll need to add your own JSON.
// I'll assume you have a config file or environment variables.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
