/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'], // 使得 Tailwind 可以在生产构建中对未使用的样式进行摇树优化。
  theme: {
    margin: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '48px'
    }
  },
  plugins: []
}
