import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import EventMap from '~/components/EventMap.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useEventStore } from '~/stores/eventStore'

import { setupTestEnvironment, setupLeafletMocks, mockEvents } from '~/tests/utils/SetupTest'

setupLeafletMocks()

vi.mock('~/stores/eventStore', () => ({
  useEventStore: vi.fn(() => ({
    loading: false,
    filteredEvents: mockEvents,
    selectedEvent: null,
    selectEvent: vi.fn(),
  })),
}))

describe('EventMap', () => {
  beforeEach(() => {
    setupTestEnvironment()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('displays a loading message when events are loading', async () => {
    // Modify the mock to simulate loading
    vi.mocked(useEventStore).mockReturnValueOnce({
      ...useEventStore(),
      loading: true,
    })

    const wrapper = mount(EventMap)
    expect(wrapper.find('.loading-overlay').exists()).toBe(true)
    expect(wrapper.find('.loading-overlay').text()).toContain('Chargement de la carte...')
  })

  it('initializes the Leaflet map on component mount', async () => {
    const wrapper = mount(EventMap)
    await flushPromises()

    const L = (await import('leaflet')).default
    expect(L.map).toHaveBeenCalled()
    expect(L.tileLayer).toHaveBeenCalledWith('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  })

  it('creates markers for each event with valid coordinates', async () => {
    const wrapper = mount(EventMap)
    await flushPromises()

    const L = (await import('leaflet')).default

    // Check that marker was called for each event
    expect(L.marker).toHaveBeenCalledTimes(2)

    // Check the coordinates used
    expect(L.marker).toHaveBeenCalledWith([48.8566, 2.3522], expect.any(Object))
    expect(L.marker).toHaveBeenCalledWith([45.764, 4.8357], expect.any(Object))
  })

  it('cleans up the map when the component is unmounted', async () => {
    const wrapper = mount(EventMap)
    await flushPromises()

    wrapper.unmount()
    const L = (await import('leaflet')).default

    // Check that the remove method was called on the map
    expect(L.map().remove).toHaveBeenCalled()
  })
})

