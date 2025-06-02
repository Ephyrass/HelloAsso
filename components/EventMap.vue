<template>
  <div class="map-container">
    <div v-if="eventStore.loading" class="loading-overlay">Chargement de la carte...</div>
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import type { Map, Marker } from 'leaflet'
import { useEventStore } from '~/stores/eventStore'

const eventStore = useEventStore()

const mapContainer = ref<HTMLElement | null>(null)
const isEventSelected = ref(false)

let map: Map | null = null
let markers: Record<string | number, Marker> = {}

function isValidCoords(coords: { lat: number; lng: number } | null) {
  return (
    coords &&
    coords.lat !== undefined &&
    coords.lng !== undefined &&
    !isNaN(coords.lat) &&
    !isNaN(coords.lng)
  )
}

// Initialize Leaflet icons
function leafletIcons(L: any) {
  delete L.Icon.Default.prototype._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

// Create a highlighted icon for the selected event
function createHighlightedIcon(L: any) {
  return new L.Icon({
    iconUrl:
      'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

// Add markers for events
function addEventMarkers(L: any) {
  if (!map) return

  // Remove existing markers
  Object.values(markers).forEach((marker) => {
    map!.removeLayer(marker)
  })
  markers = {}

  const bounds = L.latLngBounds()
  let markerCount = 0

  eventStore.filteredEvents.forEach((event) => {
    if (isValidCoords(event.coords)) {
      const isSelected = eventStore.selectedEvent && eventStore.selectedEvent.id === event.id
      const markerOptions = isSelected ? { icon: createHighlightedIcon(L) } : {}

      const marker = L.marker([event.coords.lat, event.coords.lng], markerOptions).addTo(map)
        .bindPopup(`<strong>${event.title}</strong><br>
                <span class="category">${event.category}</span><br>
                <p class="description">${event.description}</p>`)

      marker.on('click', () => {
        eventStore.selectEvent(event)
        isEventSelected.value = true
      })

      // Immediately open the popup if this event is selected
      if (isSelected) {
        setTimeout(() => {
          marker.openPopup()
        }, 100)
      }

      markers[event.id] = marker
      bounds.extend([event.coords.lat, event.coords.lng])
      markerCount++
    }
  })

  if (markerCount > 0 && !isEventSelected.value) {
    map.fitBounds(bounds, { padding: [50, 50] })
  }
}

// Cache for Leaflet to avoid repeated imports
let leafletInstance: any | null = null

onMounted(async () => {
  try {
    // Ensure code runs on client side
    if (process.client) {
      await import('leaflet/dist/leaflet.css')

      if (!leafletInstance) {
        leafletInstance = await import('leaflet').then((m) => m.default)
      }
      const L = leafletInstance

      leafletIcons(L)

      // Initialize map
      if (mapContainer.value) {
        map = L.map(mapContainer.value).setView([48.8566, 2.3522], 6)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

        // Add markers for events
        addEventMarkers(L)
      }
    }
  } catch (error) {
    console.error('Error initializing map:', error)
  }
})

watch(
  () => eventStore.filteredEvents,
  async () => {
    if (map && process.client) {
      if (!leafletInstance) {
        leafletInstance = await import('leaflet').then((m) => m.default)
      }
      addEventMarkers(leafletInstance)
    }
  },
  { deep: true }
)

watch(
  () => eventStore.selectedEvent,
  async () => {
    if (!map || !process.client) return

    if (!leafletInstance) {
      leafletInstance = await import('leaflet').then((m) => m.default)
    }
    const L = leafletInstance

    Object.entries(markers).forEach(([id, marker]: [string, any]) => {
      const isSelected =
        eventStore.selectedEvent && String(eventStore.selectedEvent.id) === String(id)

      if (isSelected) {
        marker.setIcon(createHighlightedIcon(L))
        marker.setZIndexOffset(1000)
        marker.openPopup()

        // Center map on selected marker with smooth animation
        if (eventStore.selectedEvent?.coords && isValidCoords(eventStore.selectedEvent.coords)) {
          map?.setView(
            [eventStore.selectedEvent.coords.lat, eventStore.selectedEvent.coords.lng],
            7, // Zoom level
            { animate: true }
          )
        }
      } else {
        marker.setIcon(new L.Icon.Default())
        marker.setZIndexOffset(0)
        marker.closePopup()
      }
    })
  },
  { immediate: true }
)

// Clean up map when component is unmounted
onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-container {
  position: relative;
  height: 100%;
  min-height: 500px;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
  z-index: 1;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
</style>
