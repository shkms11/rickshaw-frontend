import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

const repoName = "rickshaw-frontend";

export default defineConfig({
    plugins: [react(), tailwindcss(), tsconfigPaths()],

    // GitHub Pages base path (IMPORTANT for deployment)
    base: `/${repoName}/`,

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
