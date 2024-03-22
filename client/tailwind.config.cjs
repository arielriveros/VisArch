module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'blue': '#03179c',
        'dark-blue': '#000840',
        'light-blue': '#6370ff',
        'purple': '#450391',
        'dark-purple': '#190233',
        'light-purple': '#a56eff'
      }
    }
  },
  plugins: [],
};