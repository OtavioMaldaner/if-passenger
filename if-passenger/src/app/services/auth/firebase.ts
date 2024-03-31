import { initializeApp } from "firebase/app";

import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAdOOGH3s7yrCLejcGOk9jNjSSEHayXZOU",
  authDomain: "if-passenger-4ca5c.firebaseapp.com",
  projectId: "if-passenger-4ca5c",
  storageBucket: "if-passenger-4ca5c.appspot.com",
  messagingSenderId: "315515042743",
  appId: "1:315515042743:web:8b47be89e6ab7a027bc632"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);