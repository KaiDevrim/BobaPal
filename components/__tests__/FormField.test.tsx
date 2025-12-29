import { FormField } from '../FormField';

describe('FormField', () => {
  it('exports FormField component', () => {
    expect(FormField).toBeDefined();
    expect(typeof FormField).toBe('function');
  });

  it('component has correct name', () => {
    expect(FormField.name).toBe('FormField');
  });
});

