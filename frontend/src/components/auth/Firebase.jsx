import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBSE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
    try {
        // open google auth in popup view
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // firebase access token front FE
        const access_token = await user.getIdToken();
        return { user, access_token }; 
    }
    catch (error) {
        console.error("Error during Google sign-in:", error);
        throw error; 
    }
};
