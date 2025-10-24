/**
 * Countdown Timer Application - PostCSS Configuration
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { fileURLToPath } from 'node:url'
import path from 'node:path'

const configDir = path.dirname(fileURLToPath(import.meta.url))

export default {
  plugins: {
    // Resolve Tailwind config relative to this file to keep paths stable after relocation
    tailwindcss: { config: path.resolve(configDir, 'tailwind.config.js') },
    autoprefixer: {},
  },
}
