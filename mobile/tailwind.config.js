module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#ccfbfa',
        rose: '#f7adad',
        yellow: '#fbf236',
        blue: '#72b3d3',
        green: '#0161bb',
      },
      fontFamily: {
        pixelTitle: ['Tiny5'],
        pixel: ['Pixelify'],
      },
    },
  },
  plugins: [],
};
