const React = require('react');
const { View } = require('react-native');

const MockMapView = jest.fn().mockImplementation(({ children, ...props }) => {
  return React.createElement(View, { testID: 'mock-map-view', ...props }, children);
});

const MockMarker = jest.fn().mockImplementation(({ children, ...props }) => {
  return React.createElement(View, { testID: 'mock-marker', ...props }, children);
});

module.exports = {
  __esModule: true,
  default: MockMapView,
  Marker: MockMarker,
  PROVIDER_GOOGLE: 'google',
  PROVIDER_DEFAULT: null,
};

