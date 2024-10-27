import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      NODE_ENV: JSON.stringify(env.NODE_ENV),
      "process.env.VITE_SERVER_PORT": JSON.stringify(env.VITE_SERVER_PORT),
      "process.env.VITE_CLIENT_PORT": JSON.stringify(env.VITE_CLIENT_PORT),
      "process.env.VITE_BACKEND_URL": JSON.stringify(env.VITE_BACKEND_URL),
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
