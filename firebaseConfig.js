// Importe os módulos necessários do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCebH7Uy17Ugr8N1QkYXopTtqBdjhkBYSA",
  authDomain: "agente-do-clima.firebaseapp.com",
  projectId: "agente-do-clima",
  storageBucket: "agente-do-clima.appspot.com",
  messagingSenderId: "194181737282",
  appId: "1:194181737282:web:aa302c132ce5945d2df6db",
  measurementId: "G-KVGGB5VF42"
};

// Inicialize o Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { auth, db };
