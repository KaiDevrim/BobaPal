import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

/**
 * Custom render function that wraps components in necessary providers
 */
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {children}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';
export { customRender as render };

/**
 * Create a mock drink object for testing
 */
export const createMockDrink = (overrides = {}) => ({
  id: 'drink-1',
  flavor: 'Matcha Latte',
  price: 5.99,
  store: 'Tsaocaa',
  occasion: 'Celebrating!',
  rating: 4,
  date: '2024-12-29',
  photoUrl: 'https://example.com/photo.jpg',
  s3Key: 'drinks/matcha.jpg',
  userId: 'user-123',
  synced: true,
  lastModified: new Date(),
  update: jest.fn((fn: any) => fn({ synced: false })),
  ...overrides,
});

/**
 * Create a mock user for testing
 */
export const createMockUser = (overrides = {}) => ({
  userId: 'user-123',
  identityId: 'identity-123',
  email: 'test@example.com',
  ...overrides,
});

/**
 * Wait for async operations to complete
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

/**
 * Mock console methods for clean test output
 */
export const mockConsole = () => {
  const originalConsole = { ...console };

  beforeAll(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });
};

