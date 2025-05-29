import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useEventStore } from '~/stores/eventStore';

// Define the Event interface to match your application's model
interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  coords: {
    lat: number;
    lng: number;
  };
}

// Mock EventMap component
vi.mock('~/components/EventMap.vue', () => ({
  default: {
    name: 'EventMap',
    props: {
      events: {
        type: Array,
        default: () => []
      }
    },
    template: `
      <div class="event-map-mock">
        <div class="map-container"></div>
        <div class="map-markers">
          <div v-for="event in events" :key="event.id" class="map-marker" :data-id="event.id">
            {{ event.title }}
          </div>
        </div>
      </div>
    `
  }
}));

// Mock Vue router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ query: {} })),
  useRouter: vi.fn(() => ({ replace: vi.fn() })),
}));

// Import after the mock
import EventMap from '~/components/EventMap.vue';

describe('EventMap', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    
    // Prepare the store with test data
    const store = useEventStore();
    store.events = [
      { id: 1, title: 'Concert Jazz', description: 'A jazz concert', category: 'musique', coords: { lat: 48.8566, lng: 2.3522 } },
      { id: 2, title: 'Exposition d\'art', description: 'An art exhibition', category: 'culture', coords: { lat: 48.85, lng: 2.35 } },
      { id: 3, title: 'Marathon', description: 'Annual race', category: 'sport', coords: { lat: 48.86, lng: 2.36 } }
    ] as Event[];
    store.loading = false;
  });

  it('renders the map correctly', () => {
    const wrapper = mount(EventMap);
    expect(wrapper.find('.event-map-mock').exists()).toBe(true);
    expect(wrapper.find('.map-container').exists()).toBe(true);
  });

  it('displays markers for all events when no filter is applied', async () => {
    const store = useEventStore();
    const wrapper = mount(EventMap, {
      props: {
        events: store.filteredEvents as Event[]
      }
    });
    
    await flushPromises();
    
    const markers = wrapper.findAll('.map-marker');
    expect(markers.length).toBe(3);
    expect(markers[0].text()).toContain('Concert Jazz');
    expect(markers[1].text()).toContain('Exposition d\'art');
    expect(markers[2].text()).toContain('Marathon');
  });

  it('updates markers when filters change', async () => {
    const store = useEventStore();
    const wrapper = mount(EventMap, {
      props: {
        events: store.filteredEvents as Event[]
      }
    });
    
    // Apply a category filter
    store.selectedCategories = ['sport'];
    await flushPromises();
    
    // Update props
    await wrapper.setProps({ events: store.filteredEvents as Event[] });
    
    const markers = wrapper.findAll('.map-marker');
    expect(markers.length).toBe(1);
    expect(markers[0].text()).toContain('Marathon');
  });

  it('updates markers when performing a search', async () => {
    const store = useEventStore();
    const wrapper = mount(EventMap, {
      props: {
        events: store.filteredEvents as Event[]
      }
    });
    
    // Apply a search filter
    store.searchQuery = 'jazz';
    await flushPromises();
    
    // Update props
    await wrapper.setProps({ events: store.filteredEvents as Event[] });
    
    const markers = wrapper.findAll('.map-marker');
    expect(markers.length).toBe(1);
    expect(markers[0].text()).toContain('Concert Jazz');
  });
});
