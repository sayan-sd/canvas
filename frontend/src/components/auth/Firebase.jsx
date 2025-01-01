import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCtvyom4wNT6ybhkD6u4WxBZBp7yfikiVg",
    authDomain: "canvas-blogging-site.firebaseapp.com",
    projectId: "canvas-blogging-site",
    storageBucket: "canvas-blogging-site.firebasestorage.app",
    messagingSenderId: "763601213190",
    appId: "1:763601213190:web:53ea1c3fbbfb135fe5f087",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Google Auth Provider
const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Get the Firebase ID token
        const access_token = await user.getIdToken();
        return { user, access_token }; // Return both user and token
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        throw error; // Propagate error for better error handling
    }
};
