/**
 * Countdown Timer Application - Tailwind Configuration
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { heroui } from "@heroui/react";
import { fileURLToPath } from "node:url";
import path from "node:path";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(configDir, "..");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(projectRoot, "index.html"),
    path.join(projectRoot, "src/**/*.{js,ts,jsx,tsx}"),
    path.join(projectRoot, "node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"),
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui(),
    require("daisyui"),
  ],
  daisyui: {
    themes: false, // Disable DaisyUI themes to avoid conflicts with HeroUI
    base: false,
    styled: true,
    utils: true,
  },
}
