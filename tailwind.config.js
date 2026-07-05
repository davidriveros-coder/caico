/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de marca CAICO: azul marino, azul intenso, blanco, acento dorado
        marino: {
          DEFAULT: '#0b1f3f',
          50: '#eef2f9',
          100: '#d6e0ee',
          200: '#adc1dd',
          300: '#7f9ccb',
          400: '#4d70a8',
          500: '#2a4d82',
          600: '#1a3563',
          700: '#132749',
          800: '#0b1f3f',
          900: '#071328',
        },
        azul: {
          DEFAULT: '#1d5fd6',
          50: '#eaf1ff',
          100: '#cfe0ff',
          200: '#a3c2ff',
          300: '#70a0ff',
          400: '#3d7cf5',
          500: '#1d5fd6',
          600: '#1549ab',
          700: '#123a86',
          800: '#102f68',
          900: '#0d2751',
        },
        dorado: {
          DEFAULT: '#f5b301',
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffdd75',
          300: '#f5b301',
          400: '#d99a00',
          500: '#b37e00',
        },
        // Tono suave para el eje de Salud Mental (evita rojos/alarmismo)
        calma: {
          50: '#f2f7fc',
          100: '#e2edf7',
          200: '#c9dcee',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        suave: '0 1px 2px rgba(11,31,63,0.05), 0 8px 24px -12px rgba(11,31,63,0.12)',
      },
      keyframes: {
        flotar: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        flotar: 'flotar 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
