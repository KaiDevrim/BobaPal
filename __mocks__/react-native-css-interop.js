// Mock for react-native-css-interop
const React = require('react');

module.exports = {
  cssInterop: jest.fn((component) => component),
  remapProps: jest.fn((component) => component),
  createInteropElement: jest.fn((type, props, ...children) => {
    return React.createElement(type, props, ...children);
  }),
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
};

