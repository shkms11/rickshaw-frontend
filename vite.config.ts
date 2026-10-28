
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
    plugins: [react(), tailwindcss(), tsconfigPaths()],

    // GitHub Pages needs a repo path; Vercel uses the domain root.
    base: isGitHubPages ? "/rickshaw-frontend/" : "/",

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },

    build: {
        outDir: "dist",
        sourcemap: false,
    },
});
