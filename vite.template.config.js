import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {},
  build: {
    outDir: "scripts/set",
    cssCodeSplit: false,
    emptyOutDir: false,
    rollupOptions: {
      input: {
        set: "src/main-s.js",
      },
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: "[name][extname]",
      },
    },
  },
});
