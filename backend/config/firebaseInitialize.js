process.emitWarning = () => { };

const admin = require('firebase-admin');
require('dotenv').config();


const firebaseInit = () => {
    const credentials = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    };

    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    });
};

module.exports = firebaseInit;
