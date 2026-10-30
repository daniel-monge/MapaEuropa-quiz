import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'spike/**/*.test.ts'],
  },
})
