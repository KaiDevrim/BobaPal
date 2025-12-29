// Mock for nativewind
module.exports = {
  styled: jest.fn((component) => component),
  useColorScheme: jest.fn(() => 'light'),
  NativeWindStyleSheet: {
    setOutput: jest.fn(),
    create: jest.fn((styles) => styles),
  },
};
