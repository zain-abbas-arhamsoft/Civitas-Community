/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontSize: {
        '48': '48px',
        '32': '32px',
        '30': '30px',
        '20': '20px',
        '18': '18px',
        '16': '16px',
        '14': '14px',
        '12': '12px',
      },
      colors: {
        'blue' : '#406AB3',
      },
      fontWeight: {
          '600' : '600',
          '500' : '500',
          '400' : '400'
      },
      backgroundColor: {
          'blueOne' : '#406AB3',
      },
      padding: {
        'container-y': '100px',
        '30': '30px',
      },
      marginBottom: {
        '24': '24px',
        '32': '32px',
      },
      borderRadius: {
        '3' : '3px',
        '4' : '4px',
      },
      borderColor: {
        'blue' : '#406AB3',
        'lightGrey' : 'rgba(64, 106, 179, 0.33)',
        'transparent' : 'transparent'
      },
      width: {
        'login-form': '532px',
        'invite-form' : '478px',
        '48' : '48%'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1400px',
      // => @media (min-width: 1536px) { ... }
    },
    colors: {
      transparent:'transparent',
      themecolor:'#406AB3',
      white:'#fff',
      black:'#000',
      grey:'#43515C',
      grey2: '#F4F4F4',
      green: '#0ACF83'
    },
  },
   plugins: [
     require('flowbite/plugin')
   ],
}