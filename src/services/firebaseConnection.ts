import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-a3aVJWpsGwaDFcY-LDo1RMqCVGAqpAU",
  authDomain: "tarefasplus-39774.firebaseapp.com",
  projectId: "tarefasplus-39774",
  storageBucket: "tarefasplus-39774.firebasestorage.app",
  messagingSenderId: "81011288419",
  appId: "1:81011288419:web:6e07af6485d5cea23d4b56",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db };
