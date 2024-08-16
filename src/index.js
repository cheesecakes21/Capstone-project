import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCbw1sFkX28_fS-UtucMuERp0SEaYd9Pl4",
  authDomain: "scissors-5d7f4.firebaseapp.com",
  projectId: "scissors-5d7f4",
  storageBucket: "scissors-5d7f4.appspot.com",
  messagingSenderId: "451890326230",
  appId: "1:451890326230:web:f189ff62db31a75b927777",
  measurementId: "G-TZP3FJ7J3G"
};

initializeApp({firebaseConfig});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
