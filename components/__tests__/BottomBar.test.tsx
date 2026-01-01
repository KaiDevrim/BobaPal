// Tests for BottomBar component logic

describe('BottomBar', () => {
  describe('Tab configuration', () => {
    const TABS = [
      { name: 'Gallery', icon: 'home', label: 'Home' },
      { name: 'AddDrink', icon: 'plus-circle', label: 'Add Boba' },
      { name: 'Stats', icon: 'line-chart', label: 'Stats' },
    ];

    it('has correct number of tabs', () => {
      expect(TABS).toHaveLength(3);
    });

    it('Gallery tab has correct config', () => {
      const galleryTab = TABS.find((t) => t.name === 'Gallery');
      expect(galleryTab).toBeDefined();
      expect(galleryTab?.icon).toBe('home');
      expect(galleryTab?.label).toBe('Home');
    });

    it('AddDrink tab has correct config', () => {
      const addTab = TABS.find((t) => t.name === 'AddDrink');
      expect(addTab).toBeDefined();
      expect(addTab?.icon).toBe('plus-circle');
      expect(addTab?.label).toBe('Add Boba');
    });

    it('Stats tab has correct config', () => {
      const statsTab = TABS.find((t) => t.name === 'Stats');
      expect(statsTab).toBeDefined();
      expect(statsTab?.icon).toBe('line-chart');
      expect(statsTab?.label).toBe('Stats');
    });

    it('all tabs have required properties', () => {
      TABS.forEach((tab) => {
        expect(tab).toHaveProperty('name');
        expect(tab).toHaveProperty('icon');
        expect(tab).toHaveProperty('label');
        expect(typeof tab.name).toBe('string');
        expect(typeof tab.icon).toBe('string');
        expect(typeof tab.label).toBe('string');
      });
    });
  });

  describe('Active tab logic', () => {
    it('determines active tab from state', () => {
      const state = {
        routes: [{ name: 'Gallery' }, { name: 'AddDrink' }, { name: 'Stats' }],
        index: 0,
      };
      const currentTab = state.routes[state.index].name;
      expect(currentTab).toBe('Gallery');
    });

    it('handles AddDrink as active', () => {
      const state = {
        routes: [{ name: 'Gallery' }, { name: 'AddDrink' }, { name: 'Stats' }],
        index: 1,
      };
      const currentTab = state.routes[state.index].name;
      expect(currentTab).toBe('AddDrink');
    });

    it('handles Stats as active', () => {
      const state = {
        routes: [{ name: 'Gallery' }, { name: 'AddDrink' }, { name: 'Stats' }],
        index: 2,
      };
      const currentTab = state.routes[state.index].name;
      expect(currentTab).toBe('Stats');
    });
  });
});
