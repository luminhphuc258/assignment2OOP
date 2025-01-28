const admin = require('firebase-admin');

// using json key to connect with firebase
const serviceAccount = require('./pandarestaurant-1ecea-firebase-adminsdk-fbsvc-8605cb50a0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;