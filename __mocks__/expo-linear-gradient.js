const React = require('react');
const { View } = require('react-native');

const LinearGradient = jest.fn().mockImplementation(({ children, ...props }) => {
  return React.createElement(View, { testID: 'mock-linear-gradient', ...props }, children);
});

module.exports = {
  LinearGradient,
};

