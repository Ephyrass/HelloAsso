import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import EventFilters from '~/components/EventFilters.vue';
import { useEventStore } from '~/stores/eventStore';

// Mock Vue router to avoid errors
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ query: {} })),
  useRouter: vi.fn(() => ({ replace: vi.fn() })),
}));

describe('EventFilters', () => {
  beforeEach(() => {
    // Set up a new pinia instance for each test
    setActivePinia(createPinia());
    
    // Prepare the store with test data
    const store = useEventStore();
    store.categories = ['sport', 'culture', 'musique'];
    store.searchQuery = '';
    store.selectedCategories = [];
  });

  it('renders the component correctly', () => {
    const wrapper = mount(EventFilters);
    expect(wrapper.find('.filters-container').exists()).toBe(true);
    expect(wrapper.find('.search-input').exists()).toBe(true);
    expect(wrapper.find('.categories-list').exists()).toBe(true);
  });

  it('displays all categories from the store', () => {
    const wrapper = mount(EventFilters);
    const categories = wrapper.findAll('.category-chip');
    
    expect(categories.length).toBe(3);
    expect(categories[0].text()).toBe('Sport');
    expect(categories[1].text()).toBe('Culture');
    expect(categories[2].text()).toBe('Musique');
  });

  it('updates the search when typing in the input field', async () => {
    const wrapper = mount(EventFilters);
    const store = useEventStore();
    
    const input = wrapper.find('.search-input');
    await input.setValue('concert');
    
    expect(store.searchQuery).toBe('concert');
  });

  it('clears the search when clicking the clear button', async () => {
    const wrapper = mount(EventFilters);
    const store = useEventStore();
    
    // First set a value
    await wrapper.find('.search-input').setValue('concert');
    expect(store.searchQuery).toBe('concert');
    
    // Then click to clear
    await wrapper.find('.clear-btn').trigger('click');
    expect(store.searchQuery).toBe('');
    expect((wrapper.find('.search-input').element as HTMLInputElement).value).toBe('');
  });

  it('selects a category on click', async () => {
    const wrapper = mount(EventFilters);
    const store = useEventStore();
    
    const categoryChip = wrapper.findAll('.category-chip')[0];
    await categoryChip.trigger('click');
    
    expect(store.selectedCategories).toContain('sport');
    expect(categoryChip.classes()).toContain('selected');
  });

  it('deselects a category on second click', async () => {
    const wrapper = mount(EventFilters);
    const store = useEventStore();
    
    // First select it
    store.selectedCategories = ['sport'];
    await (wrapper.vm as any).$nextTick();
    
    // Check that it's selected
    const categoryChip = wrapper.findAll('.category-chip')[0];
    expect(categoryChip.classes()).toContain('selected');
    
    // Deselect it
    await categoryChip.trigger('click');
    expect(store.selectedCategories).not.toContain('sport');
  });

  it('synchronizes with store values', async () => {
    const store = useEventStore();
    store.searchQuery = 'event';
    store.selectedCategories = ['culture'];
    
    const wrapper = mount(EventFilters);
    
    // Check that the search input has the correct value
    expect((wrapper.find('.search-input').element as HTMLInputElement).value).toBe('event');
    
    // Check that the right category is selected
    const categoryChips = wrapper.findAll('.category-chip');
    expect(categoryChips[1].classes()).toContain('selected'); // culture is at index 1
  });
});
