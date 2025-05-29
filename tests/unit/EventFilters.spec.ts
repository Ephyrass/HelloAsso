// components/EventFilters.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EventFilters from '../../components/EventFilters.vue';

describe('EventFilters', () => {
  const categories = ['sport', 'spectacles', 'concerts', 'ateliers'];

  it('correctly displays interface elements', () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: [],
      },
    });

    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.findAll('.category-chip').length).toBe(categories.length);
    expect(wrapper.find('.search-icon').exists()).toBe(true);
    expect(wrapper.find('.filter-title').text()).toContain('Recherche');
    expect(wrapper.findAll('.filter-title')[1].text()).toContain('Catégories');
  });

  it('initializes values with props', () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: 'Paris',
        categories,
        selectedCategories: ['sport', 'concerts'],
      },
    });

    const input: any = wrapper.find('input[type="text"]');
    expect(input.element.value).toBe('Paris');

    const selectedChips = wrapper.findAll('.category-chip.selected');
    expect(selectedChips.length).toBe(2);
    expect(selectedChips[0].text()).toContain('Sport');
    expect(selectedChips[1].text()).toContain('Concerts');
  });

  it('emits update:search event when input is modified', async () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: [],
      },
    });

    const input = wrapper.find('input[type="text"]');
    await input.setValue('Concert');

    expect(wrapper.emitted('update:search')).toBeTruthy();
    expect(wrapper.emitted('update:search')![0]).toEqual(['Concert']);
  });

  it('emits update:selectedCategories event when clicking on a category', async () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: [],
      },
    });

    const categoryChips = wrapper.findAll('.category-chip');
    await categoryChips[1].trigger('click'); // Click on "spectacles"

    expect(wrapper.emitted('update:selectedCategories')).toBeTruthy();
    expect(wrapper.emitted('update:selectedCategories')![0][0]).toEqual(['spectacles']);
  });

  it('adds and removes categories from selection', async () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: ['sport'],
      },
    });

    // Verify a category is already selected
    let selectedChips = wrapper.findAll('.category-chip.selected');
    expect(selectedChips.length).toBe(1);
    expect(selectedChips[0].text()).toContain('Sport');

    // Click to add a new category
    const categoryChips = wrapper.findAll('.category-chip');
    const concertsChip = categoryChips[2]; // "concerts" is at index 2
    await concertsChip.trigger('click');

    // Verify the event is emitted with correct values
    expect(wrapper.emitted('update:selectedCategories')).toBeTruthy();
    expect(wrapper.emitted('update:selectedCategories')![0][0]).toEqual(['sport', 'concerts']);

    const sportChip = categoryChips[0];
    await sportChip.trigger('click');

    expect(wrapper.emitted('update:selectedCategories')![1][0]).toEqual(['concerts']);
  });

  it('resets search when clicking the clear button', async () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: 'Paris',
        categories,
        selectedCategories: [],
      },
    });

    expect(wrapper.find('.clear-btn').exists()).toBe(true);

    await wrapper.find('.clear-btn').trigger('click');

    expect(wrapper.emitted('update:search')).toBeTruthy();
    expect(wrapper.emitted('update:search')![0]).toEqual(['']);
    expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe('');

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.clear-btn').exists()).toBe(false);
  });

  it('correctly capitalizes the first letter of categories', () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: [],
      },
    });

    const categoryChips = wrapper.findAll('.category-chip');
    categories.forEach((category, index) => {
      const expectedText = category.charAt(0).toUpperCase() + category.slice(1);
      expect(categoryChips[index].text().trim()).toBe(expectedText);
    });
  });

  it('updates selection when selectedCategories props change', async () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: [],
      },
    });

    // Initially, no category is selected
    expect(wrapper.findAll('.category-chip.selected').length).toBe(0);

    // Update the selectedCategories prop
    await wrapper.setProps({ selectedCategories: ['sport', 'ateliers'] });

    // Verify the right categories are now selected
    const selectedChips = wrapper.findAll('.category-chip.selected');
    expect(selectedChips.length).toBe(2);
    expect(selectedChips[0].text()).toContain('Sport');
    expect(selectedChips[1].text()).toContain('Ateliers');
  });
});
