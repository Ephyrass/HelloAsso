// components/EventFilters.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EventFilters from './EventFilters.vue';

describe('EventFilters', () => {
  const categories = ['sport', 'spectacles', 'concerts', 'ateliers'];

  it('affiche correctement les éléments d\'interface', () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: []
      }
    });

    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.findAll('.category-chip').length).toBe(categories.length);
    expect(wrapper.find('.search-icon').exists()).toBe(true);
    expect(wrapper.find('.filter-title').text()).toContain('Recherche');
    expect(wrapper.findAll('.filter-title')[1].text()).toContain('Catégories');
  });

  it('initialise les valeurs avec les props', () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: 'Paris',
        categories,
        selectedCategories: ['sport', 'concerts']
      }
    });

    const input: any = wrapper.find('input[type="text"]');
    expect(input.element.value).toBe('Paris');

    const selectedChips = wrapper.findAll('.category-chip.selected');
    expect(selectedChips.length).toBe(2);
    expect(selectedChips[0].text()).toContain('Sport');
    expect(selectedChips[1].text()).toContain('Concerts');
  });

  it('émet l\'événement update:search lors de la modification de l\'input', async () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: []
      }
    });

    const input = wrapper.find('input[type="text"]');
    await input.setValue('Concert');

    expect(wrapper.emitted('update:search')).toBeTruthy();
    expect(wrapper.emitted('update:search')![0]).toEqual(['Concert']);
  });

  it('émet l\'événement update:selectedCategories lors du clic sur une catégorie', async () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: []
      }
    });

    const categoryChips = wrapper.findAll('.category-chip');
    await categoryChips[1].trigger('click'); // Clic sur "spectacles"

    expect(wrapper.emitted('update:selectedCategories')).toBeTruthy();
    expect(wrapper.emitted('update:selectedCategories')![0][0]).toEqual(['spectacles']);
  });

  it('ajoute et retire des catégories de la sélection', async () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: ['sport']
      }
    });

    // Vérifier qu'une catégorie est déjà sélectionnée
    let selectedChips = wrapper.findAll('.category-chip.selected');
    expect(selectedChips.length).toBe(1);
    expect(selectedChips[0].text()).toContain('Sport');

    // Cliquer pour ajouter une nouvelle catégorie
    const categoryChips = wrapper.findAll('.category-chip');
    const concertsChip = categoryChips[2]; // "concerts" est à l'index 2
    await concertsChip.trigger('click');

    // Vérifier que l'événement est émis avec les bonnes valeurs
    expect(wrapper.emitted('update:selectedCategories')).toBeTruthy();
    expect(wrapper.emitted('update:selectedCategories')![0][0]).toEqual(['sport', 'concerts']);

    const sportChip = categoryChips[0];
    await sportChip.trigger('click');

    expect(wrapper.emitted('update:selectedCategories')![1][0]).toEqual(['concerts']);
  });

  it('réinitialise la recherche lors du clic sur le bouton clear', async () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: 'Paris',
        categories,
        selectedCategories: []
      }
    });

    expect(wrapper.find('.clear-btn').exists()).toBe(true);

    await wrapper.find('.clear-btn').trigger('click');

    expect(wrapper.emitted('update:search')).toBeTruthy();
    expect(wrapper.emitted('update:search')![0]).toEqual(['']);

    expect(wrapper.find('input[type="text"]').element.value).toBe('');

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.clear-btn').exists()).toBe(false);
  });

  it('capitalise correctement la première lettre des catégories', () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: []
      }
    });

    const categoryChips = wrapper.findAll('.category-chip');
    categories.forEach((category, index) => {
      const expectedText = category.charAt(0).toUpperCase() + category.slice(1);
      expect(categoryChips[index].text().trim()).toBe(expectedText);
    });
  });

  it('met à jour la sélection lorsque les props selectedCategories changent', async () => {
    const wrapper = mount(EventFilters, {
      props: {
        search: '',
        categories,
        selectedCategories: []
      }
    });

    // Initialement, aucune catégorie n'est sélectionnée
    expect(wrapper.findAll('.category-chip.selected').length).toBe(0);

    // Mettre à jour la prop selectedCategories
    await wrapper.setProps({ selectedCategories: ['sport', 'ateliers'] });

    // Vérifier que les bonnes catégories sont maintenant sélectionnées
    const selectedChips = wrapper.findAll('.category-chip.selected');
    expect(selectedChips.length).toBe(2);
    expect(selectedChips[0].text()).toContain('Sport');
    expect(selectedChips[1].text()).toContain('Ateliers');
  });
});

