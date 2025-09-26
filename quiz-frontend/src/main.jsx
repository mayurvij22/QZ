// src/main.jsx
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Root component with fallback UI
const Root = () => (
  <StrictMode>
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-gray-600 text-base sm:text-lg md:text-xl">
          Loading application...
        </div>
      }
    >
      <App />
    </Suspense>
  </StrictMode>
);

createRoot(document.getElementById("root")).render(<Root />);
