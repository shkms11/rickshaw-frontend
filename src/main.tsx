import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./app/App";

// Mount the routed React application into the single HTML root element.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
