// export default {

//   theme: {
//     screens: {
//       xs:"152px",
//       mobile: "320px",
//       // => @media (min-width: 320px) { ... }
//       tablet: "640px",
//       // => @media (min-width: 640px) { ... }

//       laptop: "1024px",
//       // => @media (min-width: 1024px) { ... }

//       desktop: "1280px",
//       // => @media (min-width: 1280px) { ... }
//     },
//   },
//    content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: "class",
//   theme: {
//     extend: {
//        keyframes: {
//         fadeIn: {
//           '0%': { opacity: 0, transform: 'translateY(20px)' },
//           '100%': { opacity: 1, transform: 'translateY(0)' },
//         },
//       },
//       animation: {
//         'fade-in': 'fadeIn 1.2s ease-out forwards',
//       },
//       keyframes: {
//   bgMove: {
//     '0%': { backgroundPosition: '50% 50%' },
//     '100%': { backgroundPosition: '50% 60%' },
//   },
// },
// animation: {
//   'bg-float': 'bgMove 8s ease-in-out infinite alternate',
// },
//     },
//   },
//   plugins: [],
// };

export default {

  theme: {
    screens: {
      xs:"152px",
      mobile: "320px",
      // => @media (min-width: 320px) { ... }
      tablet: "640px",
      // => @media (min-width: 640px) { ... }

      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }

      desktop: "1280px",
      // => @media (min-width: 1280px) { ... }

      tv: "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
     
    },
  },
  plugins: [],
};

