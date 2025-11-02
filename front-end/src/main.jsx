// ----------------------------------------------- CSS

import "./main.css";

// ----------------------------------------------- React

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom";




if (typeof window !== 'undefined' && !window.global) {

  window.global = window;
}

// React ignore StrictMode dans le build de production

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
)
