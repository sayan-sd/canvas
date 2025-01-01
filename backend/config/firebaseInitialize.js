process.emitWarning = () => {};
const admin = require("firebase-admin");
const serviceAccessKey = require("../utils/firebaseServiceAccKey.json");

const firebaseInit = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccessKey),
    });
};

module.exports = firebaseInit;
