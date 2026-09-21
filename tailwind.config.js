/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1A73E8',
          'blue-dark': '#1557B0',
          'blue-light': '#E8F0FE',
          red: '#EA4335',
          'red-light': '#FCE8E6',
          yellow: '#FBBC04',
          'yellow-light': '#FEF7E0',
          green: '#34A853',
          'green-light': '#E6F4EA',
          gray: '#5F6368',
          'gray-light': '#F8F9FA',
          border: '#E8EAED',
          charcoal: '#202124',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Google Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'google-card': '0 1px 3px 0 rgba(60,64,67,0.12), 0 1px 2px 0 rgba(60,64,67,0.08)',
        'google-hover': '0 4px 12px 0 rgba(60,64,67,0.15), 0 1px 3px 0 rgba(60,64,67,0.1)',
        'google-modal': '0 12px 28px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}
