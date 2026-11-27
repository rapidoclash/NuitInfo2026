// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Pas de prefetch, pas de télémétrie : on ne charge que ce qui est utile.
  prefetch: false,
  build: {
    // Met le CSS dans la page quand il est petit : une requête en moins.
    inlineStylesheets: "auto",
  },
  security: {
    // Génère une Content-Security-Policy avec les hash des scripts/styles.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
