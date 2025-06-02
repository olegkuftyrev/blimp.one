import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Только подсказываем, какой ESM-entry брать,
      // а само имя пакета не трогаем.
      "@chakra-ui/react/dist/index.mjs":
        "@chakra-ui/react/dist/index.mjs",
    },
  },
});
