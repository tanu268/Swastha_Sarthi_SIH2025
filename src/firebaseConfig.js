import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaUtkEsvvEdS-rCpI3cQ0aBnDl_7omIHc",
  authDomain: "swastha-sarthi-f775f.firebaseapp.com",
  projectId: "swastha-sarthi-f775f",
  storageBucket: "swastha-sarthi-f775f.appspot.com", 
  messagingSenderId: "285551569113",
  appId: "1:285551569113:web:e5fe36e2b8aa1744aa36c8",
  measurementId: "G-S2Y5D0T2FK"
};

const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
export{app,auth};