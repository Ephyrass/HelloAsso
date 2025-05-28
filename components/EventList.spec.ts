// components/EventList.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import EventList from './EventList.vue';

const mockEvents = [
  {
    id: 1,
    title: "Test Event 1",
    description: "Description 1",
    category: "sport",
    coords: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: 2,
    title: "Test Event 2",
    description: "Description 2",
    category: "concerts",
    coords: { lat: 45.516, lng: 4.8757 }
  }
];

describe('EventList', () => {
  it('affiche le message de chargement quand loading est true', () => {
    const wrapper = mount(EventList, {
      props: {
        events: [],
        loading: true,
        selectedEvent: null
      }
    });

    expect(wrapper.find('.loading').exists()).toBe(true);
    expect(wrapper.find('.loading').text()).toContain('Chargement des événements');
  });

  it('affiche le message "Aucun événement trouvé" quand la liste est vide', () => {
    const wrapper = mount(EventList, {
      props: {
        events: [],
        loading: false,
        selectedEvent: null
      }
    });

    expect(wrapper.find('.no-events').exists()).toBe(true);
    expect(wrapper.find('.no-events').text()).toContain('Aucun événement trouvé');
  });

  it('affiche correctement la liste des événements', () => {
    const wrapper = mount(EventList, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null
      }
    });

    const eventItems = wrapper.findAll('.event-item');
    expect(eventItems.length).toBe(2);
    expect(eventItems[0].text()).toContain('Test Event 1');
    expect(eventItems[0].text()).toContain('sport');
    expect(eventItems[1].text()).toContain('Test Event 2');
    expect(eventItems[1].text()).toContain('concerts');
  });

  it('applique la classe selected à l\'événement sélectionné', () => {
    const wrapper = mount(EventList, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: mockEvents[0]
      }
    });

    const eventItems = wrapper.findAll('.event-item');
    expect(eventItems[0].classes()).toContain('selected');
    expect(eventItems[1].classes()).not.toContain('selected');
  });

  it('émet l\'événement select lors du clic sur un événement', async () => {
    const wrapper = mount(EventList, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null
      }
    });

    const eventItems = wrapper.findAll('.event-item');
    await eventItems[1].trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')![0][0]).toEqual(mockEvents[1]);
  });

  it('fait défiler vers l\'événement sélectionné', async () => {
    // Mock de scrollIntoView
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const wrapper = mount(EventList, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: mockEvents[1]
      }
    });

    await flushPromises();

    expect(scrollIntoViewMock).toHaveBeenCalledOnce();
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('ne déclenche pas de défilement quand selectedEvent est null', async () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const wrapper = mount(EventList, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null
      }
    });

    await flushPromises();

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });
});

