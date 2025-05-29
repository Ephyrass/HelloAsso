// components/EventList.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import EventList from '../../components/EventList.vue';

const mockEvents = [
  {
    id: 1,
    title: 'Test Event 1',
    description: 'Description 1',
    category: 'sport',
    coords: { lat: 48.8566, lng: 2.3522 },
  },
  {
    id: 2,
    title: 'Test Event 2',
    description: 'Description 2',
    category: 'concerts',
    coords: { lat: 45.516, lng: 4.8757 },
  },
];

describe('EventList', () => {
  it('displays loading message when loading is true', () => {
    const wrapper = mount(EventList, {
      props: {
        events: [],
        loading: true,
        selectedEvent: null,
      },
    });

    expect(wrapper.find('.loading').exists()).toBe(true);
    expect(wrapper.find('.loading').text()).toContain('Chargement des événements');
  });

  it('displays "No events found" message when list is empty', () => {
    const wrapper = mount(EventList, {
      props: {
        events: [],
        loading: false,
        selectedEvent: null,
      },
    });

    expect(wrapper.find('.no-events').exists()).toBe(true);
    expect(wrapper.find('.no-events').text()).toContain('Aucun événement trouvé');
  });

  it('correctly displays the list of events', () => {
    const wrapper = mount(EventList, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null,
      },
    });

    const eventItems = wrapper.findAll('.event-item');
    expect(eventItems.length).toBe(2);
    expect(eventItems[0].text()).toContain('Test Event 1');
    expect(eventItems[0].text()).toContain('sport');
    expect(eventItems[1].text()).toContain('Test Event 2');
    expect(eventItems[1].text()).toContain('concerts');
  });

  it('applies selected class to the selected event', () => {
    const wrapper = mount(EventList, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: mockEvents[0],
      },
    });

    const eventItems = wrapper.findAll('.event-item');
    expect(eventItems[0].classes()).toContain('selected');
    expect(eventItems[1].classes()).not.toContain('selected');
  });

  it('emits select event when clicking on an event', async () => {
    const wrapper = mount(EventList, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null,
      },
    });

    const eventItems = wrapper.findAll('.event-item');
    await eventItems[1].trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')![0][0]).toEqual(mockEvents[1]);
  });

  it('scrolls to the selected event', async () => {
    // Mock scrollIntoView
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const wrapper = mount(EventList, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: mockEvents[1],
      },
    });

    await flushPromises();

    expect(scrollIntoViewMock).toHaveBeenCalledOnce();
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('does not trigger scrolling when selectedEvent is null', async () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const wrapper = mount(EventList, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null,
      },
    });

    await flushPromises();

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });
});
