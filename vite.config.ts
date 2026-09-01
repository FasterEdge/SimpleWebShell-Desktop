// ─────────────────────────────────────────────────────────────
// FasterEdge 开源项目
// Github: https://github.com/FasterEdge
// Gitee:  https://gitee.com/FasterEdge
// ─────────────────────────────────────────────────────────────
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({ plugins: [vue()], clearScreen: false, server: { port: 1420, strictPort: true } })
