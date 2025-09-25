// src/main.jsx
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Optionally: fallback UI for lazy-loaded routes/pages
const Root = () => (
  <StrictMode>
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <App />
    </Suspense>
  </StrictMode>
);

createRoot(document.getElementById("root")).render(<Root />);
