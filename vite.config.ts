import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { seoRoutes, SITE_URL } from "./src/lib/seo-routes";

function generateSitemap(dir: string) {
  const urls = Object.values(seoRoutes)
    .map(
      (route) =>
        `  <url>\n    <loc>${SITE_URL}${route.path === "/" ? "" : route.path}</loc>\n    <priority>${route.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(dir, "sitemap.xml"), xml);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  ssgOptions: {
    dirStyle: "nested",
    mock: true,
    onFinished: generateSitemap,
  },
}));
