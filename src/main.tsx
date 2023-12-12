import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "./i18n/i18n.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <NextThemesProvider attribute="class">
      <App />
    </NextThemesProvider>
  </NextUIProvider>
);
