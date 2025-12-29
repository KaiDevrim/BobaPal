import { Button } from '../Button';

describe('Button', () => {
  it('exports Button component', () => {
    expect(Button).toBeDefined();
    expect(typeof Button).toBe('function');
  });

  it('component has correct name', () => {
    expect(Button.name).toBe('Button');
  });
});

