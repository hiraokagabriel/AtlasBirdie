import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),

  // Garante uma única cópia do React no monorepo com pnpm.
  // Sem isso, pacotes em node_modules de workspaces diferentes
  // podem resolver 'react' de caminhos distintos, causando
  // "Invalid hook call" mesmo com código correto.
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    }
    return config
  },
}

export default nextConfig
