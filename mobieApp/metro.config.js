const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Custom resolver to exclude react-native-maps on web
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Block react-native-maps on web platform
    if (moduleName === 'react-native-maps' && platform === 'web') {
      return {
        type: 'sourceFile',
        filePath: path.resolve(__dirname, 'shims/react-native-maps.web.js'),
      };
    }
    
    // Use default resolver for all other cases
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
