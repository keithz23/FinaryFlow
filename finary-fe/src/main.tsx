import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./providers/AppProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>
  </AppProvider>
);
