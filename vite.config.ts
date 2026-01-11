import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const REPO_NAME = "StorySpark-Studio";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

  return {
    // สำคัญมากสำหรับ GitHub Pages แบบ project site: /<repo>/
    base: mode === "development" ? "/" : `/${REPO_NAME}/`,

    server: {
      port: 3000,
      host: "0.0.0.0",
    },

    plugins: [react()],

    define: {
      "process.env.API_KEY": JSON.stringify(apiKey),
      "process.env.GEMINI_API_KEY": JSON.stringify(apiKey),
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },

    // ✅ ลด warning chunk > 500KB + โหลดเร็วขึ้นบนมือถือ
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            lucide: ["lucide-react"],
            genai: ["@google/genai"],
          },
        },
      },
      // ถ้ายังเตือนอยู่และคุณไม่อยากเห็น warning ปรับได้ (หน่วย kB)
      // chunkSizeWarningLimit: 800,
    },
  };
});
