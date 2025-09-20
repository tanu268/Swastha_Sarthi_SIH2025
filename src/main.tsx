import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n"; // must run before any components that call useTranslation

import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./hooks/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

createRoot(document.getElementById("root")!).render(<App />);
