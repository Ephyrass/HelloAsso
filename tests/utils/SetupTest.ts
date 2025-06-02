import { vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Environment configuration
export function setupTestEnvironment() {
  if (!globalThis.process) globalThis.process = {} as any
  if (!globalThis.process.env) globalThis.process.env = {} as any
  globalThis.process.env.NODE_ENV = 'test'

  // Configure Pinia
  setActivePinia(createPinia())

  // Simulate browser environment
  vi.stubGlobal('process', { client: true })
}

// Reusable test data
export const mockEvents = [
  {
    id: 1,
    title: 'Test Event 1',
    description: 'Test description 1',
    category: 'Category 1',
    coords: { lat: 48.8566, lng: 2.3522 },
  },
  {
    id: 2,
    title: 'Test Event 2',
    description: 'Test description 2',
    category: 'Category 2',
    coords: { lat: 45.764, lng: 4.8357 },
  },
]

// Leaflet mock
export function setupLeafletMocks() {
  vi.mock('leaflet', () => {
    const mockMap = {
      setView: vi.fn().mockReturnThis(),
      fitBounds: vi.fn(),
      removeLayer: vi.fn(),
      remove: vi.fn(),
    }

    const mockMarker = {
      addTo: vi.fn().mockReturnThis(),
      bindPopup: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      openPopup: vi.fn(),
      closePopup: vi.fn(),
      setIcon: vi.fn(),
      setZIndexOffset: vi.fn(),
    }

    return {
      default: {
        map: vi.fn().mockReturnValue(mockMap),
        tileLayer: vi.fn().mockReturnValue({ addTo: vi.fn() }),
        marker: vi.fn().mockReturnValue(mockMarker),
        latLngBounds: vi.fn().mockReturnValue({
          extend: vi.fn(),
        }),
        Icon: {
          Default: {
            prototype: {
              _getIconUrl: {},
            },
            mergeOptions: vi.fn(),
          },
        },
      },
    }
  })

  vi.mock('leaflet/dist/leaflet.css', () => ({}))
}