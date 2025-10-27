/**
 * Countdown Timer Application - PostCSS Configuration
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import postcssLib from 'postcss'
import tailwindcss from 'tailwindcss'

const configDir = path.dirname(fileURLToPath(import.meta.url))
const FALLBACK_FROM = 'tailwindcss-internal://generated'

function ensureDefaultFrom(postcss) {
  if (postcss.parse.__ensureDefaultFromApplied) {
    return
  }

  const originalParse = postcss.parse

  const patchedParse = function patchedParse(css, opts) {
    const nextOpts = opts ? { ...opts } : {}

    if (nextOpts.from == null) {
      nextOpts.from = FALLBACK_FROM
    }

    return originalParse.call(this, css, nextOpts)
  }

  patchedParse.__ensureDefaultFromApplied = true
  postcss.parse = patchedParse
}

function ensureDeclarationSources() {
  return {
    postcssPlugin: 'ensure-declaration-sources',
    Once(root, { result }) {
      const inferredFrom = result.opts.from ?? FALLBACK_FROM

      root.walkDecls((decl) => {
        if (decl.source?.input?.file) {
          return
        }

        const nextInput = decl.source?.input ? { ...decl.source.input } : {}
        if (!nextInput.file) {
          nextInput.file = inferredFrom
        }

        const nextSource = decl.source ? { ...decl.source } : {}
        nextSource.input = nextInput
        decl.source = nextSource
      })
    },
  }
}
ensureDeclarationSources.postcss = true

// Tailwind and Autoprefixer parse synthetic CSS snippets without setting `from`.
// Patch PostCSS so a predictable virtual filename is supplied to avoid warnings.
ensureDefaultFrom(postcssLib)

const { default: autoprefixer } = await import('autoprefixer')

export default {
  plugins: [
    tailwindcss({
      // Resolve Tailwind config relative to this file to keep paths stable after relocation
      config: path.resolve(configDir, 'tailwind.config.js'),
    }),
    autoprefixer(),
    ensureDeclarationSources(),
  ],
}
