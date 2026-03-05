import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    server:{
      watch: {
        usePolling: true
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173
      }
    },
    plugins: [
      vue(),
      vueDevTools()
    ],
    css: {
        preprocessorOptions: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            scss: {
                silenceDeprecations: ["mixed-decls", "color-functions", "global-builtin", "import"],
            } as any,
        },
    }
})
