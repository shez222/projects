// babel.config.js

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'], // If you're using Expo
//     plugins: ['nativewind/babel'],   // Add this line
//   };
// };

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
