import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c0d10",
        mist: "#f6f7fb",
        accent: "#1a7f7a",
        coral: "#e67e5a",
        slate: "#1f2937"
      },
      fontFamily: {
        display: ["\"Satoshi\"", "ui-sans-serif", "system-ui"],
        body: ["\"Satoshi\"", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
