// components/EventMap.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import EventMap from './EventMap.vue';

// Mock de Leaflet plus complet
const mockSetIcon = vi.fn();
const mockOpenPopup = vi.fn();
const mockClosePopup = vi.fn();
const mockSetZIndexOffset = vi.fn();
const mockFitBounds = vi.fn();
const mockAddTo = vi.fn().mockReturnThis();
const mockBindPopup = vi.fn().mockReturnThis();
const mockOn = vi.fn().mockReturnThis();
const mockRemoveLayer = vi.fn();

// Mock de Leaflet simplifié
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

// Mock de setTimeout
vi.stubGlobal('setTimeout', (callback: Function, _: number) => {
  callback();
  return 0;
});

// Mock de l'import CSS
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

    // Mock global process.client pour simuler l'environnement client
    vi.stubGlobal('process', { client: true });
  });

  it('affiche le texte de chargement lorsque loading est true', () => {
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

  it('initialise la carte lorsque le composant est monté', async () => {
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

  it('ajoute un marqueur pour chaque événement avec des coordonnées valides', async () => {
    const wrapper = mount(EventMap, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null
      }
    });

    await flushPromises();

    // Vérifie que marker a été appelé pour chaque événement
    const leafletModule = await import('leaflet');
    expect(leafletModule.default.marker).toHaveBeenCalledTimes(mockEvents.length);
    expect(mockAddTo).toHaveBeenCalledTimes(mockEvents.length);
    expect(mockBindPopup).toHaveBeenCalledTimes(mockEvents.length);
  });


  it('émet l\'événement select lors du clic sur un marqueur', async () => {
    const wrapper = mount(EventMap, {
      props: {
        events: mockEvents,
        loading: false,
        selectedEvent: null
      }
    });

    await flushPromises();

    // Simuler le clic sur le marqueur en appelant directement le gestionnaire d'événement
    const clickHandler = mockOn.mock.calls.find(call => call[0] === 'click')?.[1];
    if (clickHandler) {
      clickHandler();
    }

    expect(wrapper.emitted('select')).toBeTruthy();
  });

  it('met à jour les marqueurs lorsque les événements changent', async () => {
    const wrapper = mount(EventMap, {
      props: {
        events: [],
        loading: false,
        selectedEvent: null
      }
    });

    await flushPromises();

    // Réinitialiser les compteurs des mocks
    vi.clearAllMocks();

    // Mettre à jour la prop events
    await wrapper.setProps({ events: mockEvents });

    // Attendre que la watch s'exécute
    await flushPromises();

    // Vérifie que marker a été appelé pour chaque nouvel événement
    const leafletModule = await import('leaflet');
    expect(leafletModule.default.marker).toHaveBeenCalledTimes(mockEvents.length);
  });

});

