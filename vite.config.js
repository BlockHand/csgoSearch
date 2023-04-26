import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
const OSS_CDN = {
  dev: '/',
  test: '/',
  pre: '/',
  production: '/'
}

export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://panyunkejigs.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },

  base: OSS_CDN[`${mode}`],
  resolve: {
    alias: {
      util: path.resolve(__dirname, 'src/util.js'),
      '@src': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
    extensions: ['.js', '.ts', '.vue', '.json']
  },
  plugins: [vue(),vueSetupExtend()],
  build: {
    assetsDir: 'static'
  }
}))
