module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#ccfbfa',
        rose: '#f7adad',
      },
      fontFamily: {
        pixel: ['GeistPixel'],
      },
    },
  },
  plugins: [],
};
