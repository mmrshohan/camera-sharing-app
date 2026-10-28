import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@tokens";
import { App } from "./App";
import "./styles/base.css";

const root = document.getElementById("root");
if (!root) throw new Error("index.html must contain #root");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
