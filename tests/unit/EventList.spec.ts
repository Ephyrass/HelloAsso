import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import EventList from '~/components/EventList.vue'
import { useEventStore } from '~/stores/eventStore'
import { setupTestEnvironment, mockEvents } from '~/tests/utils/SetupTest'

// Event store mock
vi.mock('~/stores/eventStore', () => ({
  useEventStore: vi.fn(() => ({
    loading: false,
    filteredEvents: mockEvents,
    selectedEvent: null,
    selectEvent: vi.fn(),
  })),
}))

describe('EventList', () => {
  beforeEach(() => {
    setupTestEnvironment()
    vi.clearAllMocks()
  })

  it('displays a loading message when loading is true', async () => {
    // Modify the mock to simulate loading
    vi.mocked(useEventStore).mockReturnValueOnce({
      ...useEventStore(),
      loading: true,
    })

    const wrapper = mount(EventList)

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toContain('Chargement des événements...')
    expect(wrapper.find('.event-item').exists()).toBe(false)
  })

  it('displays a message when no events are found', async () => {
    // Modify the mock to simulate an empty list
    vi.mocked(useEventStore).mockReturnValueOnce({
      ...useEventStore(),
      filteredEvents: [],
    })

    const wrapper = mount(EventList)

    expect(wrapper.find('.no-events').exists()).toBe(true)
    expect(wrapper.find('.no-events').text()).toContain('Aucun événement trouvé')
    expect(wrapper.find('.event-item').exists()).toBe(false)
  })

  it('displays the list of events', async () => {
    const wrapper = mount(EventList)

    const eventItems = wrapper.findAll('.event-item')
    expect(eventItems.length).toBe(2)

    expect(eventItems[0].find('h3').text()).toBe('Test Event 1')
    expect(eventItems[0].find('.category-badge').text()).toBe('Category 1')
    expect(eventItems[0].find('p').text()).toBe('Test description 1')

    expect(eventItems[1].find('h3').text()).toBe('Test Event 2')
    expect(eventItems[1].find('.category-badge').text()).toBe('Category 2')
    expect(eventItems[1].find('p').text()).toBe('Test description 2')
  })

  it('calls selectEvent when clicking on an event', async () => {
    const mockSelectEvent = vi.fn()
    vi.mocked(useEventStore).mockReturnValueOnce({
      ...useEventStore(),
      selectEvent: mockSelectEvent,
    })

    const wrapper = mount(EventList)

    await wrapper.findAll('.event-item')[0].trigger('click')
    expect(mockSelectEvent).toHaveBeenCalledWith(mockEvents[0])

    await wrapper.findAll('.event-item')[1].trigger('click')
    expect(mockSelectEvent).toHaveBeenCalledWith(mockEvents[1])
  })

  it('applies the "selected" class to the selected event', async () => {
    vi.mocked(useEventStore).mockReturnValueOnce({
      ...useEventStore(),
      selectedEvent: mockEvents[0],
    })

    const wrapper = mount(EventList)

    const eventItems = wrapper.findAll('.event-item')
    expect(eventItems[0].classes()).toContain('selected')
    expect(eventItems[1].classes()).not.toContain('selected')
  })

  it('calls scrollIntoView when an event is selected', async () => {
    // Create a mock for scrollIntoView
    const scrollIntoViewMock = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoViewMock

    // Simulate a selected event
    const selectedEvent = mockEvents[0]
    vi.mocked(useEventStore).mockReturnValue({
      ...useEventStore(),
      selectedEvent,
    })

    mount(EventList)
    await flushPromises()

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' })
  })
})
