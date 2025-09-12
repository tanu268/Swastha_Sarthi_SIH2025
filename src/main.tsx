import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n"; // must run before any components that call useTranslation


createRoot(document.getElementById("root")!).render(<App />);
