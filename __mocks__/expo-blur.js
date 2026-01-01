-const React = require('react');
const { View } = require('react-native');

const BlurView = jest.fn().mockImplementation(({ children, ...props }) => {
  return React.createElement(View, { testID: 'mock-blur-view', ...props }, children);
});

module.exports = {
  BlurView,
};

