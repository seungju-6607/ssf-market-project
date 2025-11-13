// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import { AuthProvider } from "./context/AuthContext.js";
import App from "./App.js";
import "./App.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthProvider>
    <Router>
      <App />
    </Router>
    </AuthProvider>
  </Provider>
);