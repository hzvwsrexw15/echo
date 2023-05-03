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
    outDir: "scripts",
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        background: "src/background.js",
        content: "src/main.js",
      },
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: "[name][extname]",
      },
    },
  },
});
