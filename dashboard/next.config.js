const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Merge existing alias
    const existingAlias = config.resolve.alias || {};

    // Set react-native alias to react-native-web
    config.resolve.alias = {
      ...existingAlias,
      'react-native': 'react-native-web',
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

    // Exclude react-native from server-side rendering
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('react-native');
      }
    }

    return config;
  },
  // Transpile react-native-web and related packages
  transpilePackages: [
    'react-native-web',
    'react-native-safe-area-context',
  ],
};

module.exports = nextConfig;
