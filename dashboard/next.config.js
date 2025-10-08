const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Merge existing alias
    const existingAlias = config.resolve.alias || {};

    // Set react-native alias to react-native-web (for both client and server)
    config.resolve.alias = {
      ...existingAlias,
      'react-native$': 'react-native-web',
      '@app': path.resolve(__dirname, '../DummyApp/src'),
    };

    // Add react-native-web extensions
    const extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
    ];

    config.resolve.extensions = [
      ...extensions,
      ...(config.resolve.extensions || []),
    ];

    return config;
  },
  // Transpile react-native-web and related packages
  transpilePackages: [
    'react-native-web',
    'react-native-safe-area-context',
  ],
};

module.exports = nextConfig;
