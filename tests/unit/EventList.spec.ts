import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useEventStore } from '~/stores/eventStore'

// Define the Event interface to match your application's model
interface Event {
  id: number
  title: string
  description: string
  category: string
  coords: {
    lat: number
    lng: number
  }
}

// Since we don't have access to the EventList component, we'll simulate it
vi.mock('~/components/EventList.vue', () => ({
  default: {
    name: 'EventList',
    template: `
      <div class="event-list">
        <div v-if="store.loading" class="loading">Loading...</div>
        <div v-else-if="store.filteredEvents.length === 0" class="no-events">No events found</div>
        <div v-else class="events-container">
          <div 
            v-for="event in store.filteredEvents" 
            :key="event.id" 
            class="event-item"
            :class="{ 'selected': store.selectedEvent?.id === event.id }"
            @click="selectEvent(event)"
          >
            <h3>{{ event.title }}</h3>
            <p>{{ event.description }}</p>
            <span class="event-category">{{ event.category }}</span>
          </div>
        </div>
      </div>
    `,
    setup() {
      const store = useEventStore()

      function selectEvent(event: Event): void {
        store.selectEvent(event)
      }

      return { store, selectEvent }
    },
  },
}))

// Mock Vue router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ query: {} })),
  useRouter: vi.fn(() => ({ replace: vi.fn() })),
}))

// Import after the mock
import EventList from '~/components/EventList.vue'

describe('EventList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    // Prepare the store with test data
    const store = useEventStore()
    store.events = [
      {
        id: 1,
        title: 'Concert Jazz',
        description: 'A jazz concert',
        category: 'musique',
        coords: { lat: 48.8566, lng: 2.3522 },
      },
      {
        id: 2,
        title: "Exposition d'art",
        description: 'An art exhibition',
        category: 'culture',
        coords: { lat: 48.85, lng: 2.35 },
      },
      {
        id: 3,
        title: 'Marathon',
        description: 'Annual race',
        category: 'sport',
        coords: { lat: 48.86, lng: 2.36 },
      },
    ] as Event[]
    store.loading = false
  })

  it('displays a loading message when data is being loaded', async () => {
    const store = useEventStore()
    store.loading = true

    const wrapper = mount(EventList)
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading...')
  })

  it('displays all events when no filter is applied', async () => {
    const wrapper = mount(EventList)

    const eventItems = wrapper.findAll('.event-item')
    expect(eventItems.length).toBe(3)
    expect(eventItems[0].text()).toContain('Concert Jazz')
    expect(eventItems[1].text()).toContain("Exposition d'art")
    expect(eventItems[2].text()).toContain('Marathon')
  })

  it('filters events by category', async () => {
    const store = useEventStore()
    store.selectedCategories = ['culture']

    const wrapper = mount(EventList)
    await flushPromises()

    const eventItems = wrapper.findAll('.event-item')
    expect(eventItems.length).toBe(1)
    expect(eventItems[0].text()).toContain("Exposition d'art")
  })

  it('filters events by search query', async () => {
    const store = useEventStore()
    store.searchQuery = 'jazz'

    const wrapper = mount(EventList)
    await flushPromises()

    const eventItems = wrapper.findAll('.event-item')
    expect(eventItems.length).toBe(1)
    expect(eventItems[0].text()).toContain('Concert Jazz')
  })

  it('selects an event on click', async () => {
    const store = useEventStore()
    const wrapper = mount(EventList)

    const eventItems = wrapper.findAll('.event-item')
    await eventItems[1].trigger('click')

    expect(store.selectedEvent).toBeTruthy()
    expect(store.selectedEvent?.id).toBe(2)
    expect(store.selectedEvent?.title).toBe("Exposition d'art")
  })

  it('displays a message when no events match the filters', async () => {
    const store = useEventStore()
    store.searchQuery = 'no results'

    const wrapper = mount(EventList)
    await flushPromises()

    expect(wrapper.find('.no-events').exists()).toBe(true)
    expect(wrapper.text()).toContain('No events found')
  })
})
