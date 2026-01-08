import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    open: true,
  },
  resolve: {
    alias: {
      "@event-map/shared": path.resolve(__dirname, "../packages/shared/dist/"),
    },
  },
  // test: {
  //   root: import.meta.dirname,
  //   name: packageJson.name,
  //   environment: "jsdom",

  //   typecheck: {
  //     enabled: true,
  //     tsconfig: path.join(import.meta.dirname, "tsconfig.json"),
  //   },

  //   globals: true,
  //   watch: false,
  //   setupFiles: ["./src/setupTests.ts"],
  // },
})
