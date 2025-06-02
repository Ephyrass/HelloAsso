import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEventStore } from '~/stores/eventStore'
import { useRoute } from 'vue-router'
import type { Event } from '~/types/Event'

// Mock for Vue Router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    query: {},
  })),
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
  })),
}))

// Mock for fetch
global.fetch = vi.fn()

describe('eventStore', () => {
  let store: ReturnType<typeof useEventStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    store = useEventStore()
  })

  it('should have the correct initial properties', () => {
    expect(store.events).toEqual([])
    expect(store.loading).toBe(true)
    expect(store.searchQuery).toBe('')
    expect(store.selectedCategories).toEqual([])
    expect(store.selectedEvent).toBe(null)
    expect(store.categories).toEqual([])
  })

  it('should fetch events from the API', async () => {
    const mockEvents = [
      {
        id: 1,
        title: 'Event 1',
        description: 'Desc 1',
        category: 'Cat A',
        coords: { lat: 10, lng: 20 },
      },
      {
        id: 2,
        title: 'Event 2',
        description: 'Desc 2',
        category: 'Cat B',
        coords: { lat: 30, lng: 40 },
      },
    ]

    // Fix typing for the mock
    const fetchMock = global.fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve(mockEvents),
    })

    await store.fetchEvents()

    expect(global.fetch).toHaveBeenCalledWith('/api/events')
    expect(store.events).toEqual(mockEvents)
    expect(store.categories).toEqual(['Cat A', 'Cat B'])
    expect(store.loading).toBe(false)
  })

  it('should filter events by search', () => {
    store.events = [
      {
        id: 1,
        title: 'Conference',
        description: 'Tech conference',
        category: 'Tech',
        coords: { lat: 10, lng: 20 },
      },
      {
        id: 2,
        title: 'Concert',
        description: 'Music event',
        category: 'Music',
        coords: { lat: 30, lng: 40 },
      },
    ] as Event[]

    expect(store.filteredEvents.length).toBe(2)

    store.searchQuery = 'tech'
    expect(store.filteredEvents.length).toBe(1)
    expect(store.filteredEvents[0].id).toBe(1)

    store.searchQuery = 'nonexistent'
    expect(store.filteredEvents.length).toBe(0)
  })

  it('should filter events by category', () => {
    store.events = [
      {
        id: 1,
        title: 'Conference',
        description: 'Tech conference',
        category: 'Tech',
        coords: { lat: 10, lng: 20 },
      },
      {
        id: 2,
        title: 'Concert',
        description: 'Music event',
        category: 'Music',
        coords: { lat: 30, lng: 40 },
      },
    ] as Event[]

    expect(store.filteredEvents.length).toBe(2)

    store.selectedCategories = ['Tech']
    expect(store.filteredEvents.length).toBe(1)
    expect(store.filteredEvents[0].id).toBe(1)

    store.selectedCategories = ['Tech', 'Music']
    expect(store.filteredEvents.length).toBe(2)
  })

  it('should select an event', () => {
    const event = {
      id: 1,
      title: 'Test',
      description: 'Description',
      category: 'Cat',
      coords: { lat: 10, lng: 20 },
    } as Event
    store.selectEvent(event)
    expect(store.selectedEvent).toEqual(event)
  })

  it('should initialize filters from the URL', () => {
    // Reset mocks before configuring
    vi.clearAllMocks()

    // Configure the mock before creating the store
    const mockRoute = {
      query: {
        search: 'test',
        categories: ['Cat A', 'Cat B'],
      },
    }
    vi.mocked(useRoute).mockReturnValue(mockRoute as any)

    // Create a new store that will use the configured mock
    setActivePinia(createPinia())
    const testStore = useEventStore()

    // Verify the values
    expect(testStore.searchQuery).toBe('test')
    expect(testStore.selectedCategories).toEqual(['Cat A', 'Cat B'])
  })

  it('should handle errors when fetching events', async () => {
    // Fix typing for the mock
    const fetchMock = global.fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockRejectedValueOnce(new Error('API error'))

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await store.fetchEvents()

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching events:', expect.any(Error))
    expect(store.loading).toBe(false)

    consoleErrorSpy.mockRestore()
  })
})
