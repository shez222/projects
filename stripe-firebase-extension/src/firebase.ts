// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDskLXzctHBSTbXqw4Tr5YEMtnPqVnyxG8",
  authDomain: "loan-emprestimo.firebaseapp.com",
  databaseURL: "https://loan-emprestimo-default-rtdb.firebaseio.com",
  projectId: "loan-emprestimo",
  storageBucket: "loan-emprestimo.appspot.com",
  messagingSenderId: "971300430518",
  appId: "1:971300430518:web:68c4b1c294e4ce9be67c17",
  measurementId: "G-X0KT29D8FS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const initFirebase = () => {
  return app;
};
