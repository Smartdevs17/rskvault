module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true, // Add this line
        },
      ],
    ],
    // ... your other babel config
  };
};