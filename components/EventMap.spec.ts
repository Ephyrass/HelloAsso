// components/EventMap.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import EventMap from './EventMap.vue';

// (Leaflet) mock
const mockSetIcon = vi.fn();
const mockOpenPopup = vi.fn();
const mockClosePopup = vi.fn();
const mockSetZIndexOffset = vi.fn();
const mockFitBounds = vi.fn();
const mockAddTo = vi.fn().mockReturnThis();
const mockBindPopup = vi.fn().mockReturnThis();
const mockOn = vi.fn().mockReturnThis();
const mockRemoveLayer = vi.fn();

// Simplified Leaflet mock
vi.mock('leaflet', () => {
  return {
    default: {
      map: vi.fn().mockImplementation(() => ({
        setView: vi.fn().mockReturnThis(),
        remove: vi.fn(),
        fitBounds: mockFitBounds,
        once: vi.fn(),
        removeLayer: mockRemoveLayer
      })),
      marker: vi.fn().mockImplementation(() => ({
        addTo: mockAddTo,
        bindPopup: mockBindPopup,
        on: mockOn,
        setIcon: mockSetIcon,
        openPopup: mockOpenPopup,
        closePopup: mockClosePopup,
        setZIndexOffset: mockSetZIndexOffset
      })),
      tileLayer: vi.fn().mockImplementation(() => ({
        addTo: vi.fn().mockReturnThis()
      })),
      Icon: {
        Default: class {
          constructor() {}
          static mergeOptions = vi.fn();
        }
      },
      latLngBounds: vi.fn().mockImplementation(() => ({
        extend: vi.fn()
      }))
    }
  };
});

// Mock setTimeout
vi.stubGlobal('setTimeout', (callback: Function, _: number) => {
  callback();
  return 0;
});

// Mock CSS import
vi.mock('leaflet/dist/leaflet.css', () => ({}));

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

describe('EventMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock global process.client to simulate client environment
    vi.stubGlobal('process', { client: true });
  });

  it('displays loading text when loading is true', () => {
    const wrapper = mount(EventMap, {
      props: {
        events: [],
        loading: true,
        selectedEvent: null
      }
    });

    expect(wrapper.find('.loading-overlay').exists()).toBe(true);
    expect(wrapper.find('.loading-overlay').text()).toContain('Chargement de la carte');
  });

  it('initializes the map when component is mounted', async () => {
    const wrapper = mount(EventMap, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null
      }
    });

    await flushPromises();
    expect(wrapper.find('#map').exists()).toBe(true);
  });

  it('adds a marker for each event with valid coordinates', async () => {
    const wrapper = mount(EventMap, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null
      }
    });

    await flushPromises();

    // Verify marker was called for each event
    const leafletModule = await import('leaflet');
    expect(leafletModule.default.marker).toHaveBeenCalledTimes(mockEvents.length);
    expect(mockAddTo).toHaveBeenCalledTimes(mockEvents.length);
    expect(mockBindPopup).toHaveBeenCalledTimes(mockEvents.length);
  });


  it('emits select event when marker is clicked', async () => {
    const wrapper = mount(EventMap, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null
      }
    });

    await flushPromises();

    // Simulate marker click by directly calling the event handler
    const clickHandler = mockOn.mock.calls.find(call => call[0] === 'click')?.[1];
    if (clickHandler) {
      clickHandler();
    }

    expect(wrapper.emitted('select')).toBeTruthy();
  });

  it('updates markers when events change', async () => {
    const wrapper = mount(EventMap, {
      props: {
        events: [],
        loading: false,
        selectedEvent: null
      }
    });

    await flushPromises();

    // Reset mock counters
    vi.clearAllMocks();

    // Update events prop
    await wrapper.setProps({ events: mockEvents });

    // Wait for the watch to execute
    await flushPromises();

    // Verify marker was called for each new event
    const leafletModule = await import('leaflet');
    expect(leafletModule.default.marker).toHaveBeenCalledTimes(mockEvents.length);
  });

});
