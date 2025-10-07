/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Alias react-native to react-native-web
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };

    // Add react-native-web extensions
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    return config;
  },
  // Transpile react-native-web and related packages
  transpilePackages: [
    'react-native',
    'react-native-web',
    'react-native-safe-area-context',
  ],
};

module.exports = nextConfig;
