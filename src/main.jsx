import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToastProvider } from "./components/Toast";
import SmoothScroll from "./components/SmoothScroll";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToastProvider>
      <SmoothScroll />
      <App />
    </ToastProvider>
  </BrowserRouter>
);
