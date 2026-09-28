module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#ccfbfa',
        rose: '#f7adad',
      },
      fontFamily: {
        pixelTitle: ['VT'],
        pixel: ['GeistPixel'],
      },
    },
  },
  plugins: [],
};
