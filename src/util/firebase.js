import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC33fGuKTgGglGBfsw6AxFaU5JBn0eGKOE",
  authDomain: "editorcloud-77692.firebaseapp.com",
  databaseURL: "https://editorcloud-77692-default-rtdb.firebaseio.com",
  projectId: "editorcloud-77692",
  storageBucket: "editorcloud-77692.firebasestorage.app",
  messagingSenderId: "867790441361",
  appId: "1:867790441361:web:ca79e75af43da7b93fe830",
  measurementId: "G-X0SDKL7H7R"
};

// Inicializa Firebase solo una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Obtén instancias de los servicios
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
