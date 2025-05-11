import { StyleProvider } from "@ant-design/cssinjs";
import "@ant-design/v5-patch-for-react-19";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

import "../css/app.css";
import { initializeTheme } from "./hooks/use-appearance";

import("dayjs/locale/id");
import("dayjs/locale/ja");

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <StyleProvider layer>
        <App {...props} />
      </StyleProvider>
    );
  },
  progress: {
    color: "#124C9A",
  },
});

// This will set light / dark mode on load...
initializeTheme();
