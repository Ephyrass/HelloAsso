<template>
  <div class="map-container">
    <div v-if="loading" class="loading-overlay">Chargement de la carte...</div>
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import type { Event } from '~/types/Event';
import type { Marker } from 'leaflet';

const props = defineProps<{
  events: Event[];
  loading: boolean;
  selectedEvent: Event | null;
}>();

const emit = defineEmits<{
  select: [event: Event];
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;
let markers: any = {};
const debugInfo = ref('');

onMounted(async () => {
  try {
    // Ensure code runs on client-side
    if (process.client) {
      // Explicit import of stylesheet
      await import('leaflet/dist/leaflet.css');

      const L = await import('leaflet').then((m) => m.default);

      debugInfo.value = `Leaflet loaded. Container: ${mapContainer.value ? 'OK' : 'Missing'}`;

      leafletIcons(L);

      // Initialize map
      if (mapContainer.value) {
        map = L.map(mapContainer.value).setView([48.8566, 2.3522], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Check if events with coordinates are available
        const eventsWithCoords = props.events.filter((e) => e.coords && true && true);

        debugInfo.value = `Events with coordinates: ${eventsWithCoords.length}/${props.events.length}`;

        // Add markers for events
        addEventMarkers(L);
      }
    }
  } catch (error) {
    console.error('Error initializing map:', error);
    debugInfo.value = `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
});

function leafletIcons(L: any) {
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

function addEventMarkers(L: any) {
  if (!map) return;

  // Remove existing markers
  Object.values(markers).forEach((marker: any) => {
    map.removeLayer(marker);
  });
  markers = {};

  const bounds = L.latLngBounds();
  let markerCount = 0;

  props.events.forEach((event) => {
    // Stricter coordinate validation
    if (event.coords && !isNaN(event.coords.lat) && !isNaN(event.coords.lng)) {
      const isSelected = props.selectedEvent && props.selectedEvent.id === event.id;
      const markerOptions = isSelected ? { icon: createHighlightedIcon(L) } : {};

      const marker = L.marker([event.coords.lat, event.coords.lng], markerOptions).addTo(map)
        .bindPopup(`<strong>${event.title}</strong><br>
                <span class="category">${event.category}</span><br>
                <p class="description">${event.description}</p>`);

      marker.on('click', () => {
        emit('select', event);
      });

      // Immediately open popup if this event is selected
      if (isSelected) {
        // Use setTimeout to ensure the popup opens after the marker is fully initialized
        setTimeout(() => {
          marker.openPopup();
        }, 100);
      }

      markers[event.id] = marker;
      bounds.extend([event.coords.lat, event.coords.lng]);
      markerCount++;
    }
  });

  debugInfo.value = `Markers added: ${markerCount}`;

  // Replace isEmpty() with a check for marker count
  if (markerCount > 0) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
}

// Create a highlighted icon for the selected marker
function createHighlightedIcon(L: any) {
  return new L.Icon({
    iconUrl:
      'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

watch(
  () => props.events,
  async () => {
    if (map && process.client) {
      const L = await import('leaflet').then((m) => m.default);
      addEventMarkers(L);
    }
  },
  { deep: true }
);

watch(
  () => props.selectedEvent,
  async () => {
    if (!map || !process.client) return;

    const L = await import('leaflet').then((m) => m.default);

    let selectedMarker: Marker | null = null;

    Object.entries(markers).forEach(([id, marker]: [string, any]) => {
      const isSelected = props.selectedEvent && String(props.selectedEvent.id) === String(id);

      if (isSelected) {
        marker.setIcon(createHighlightedIcon(L));
        selectedMarker = marker;
        marker.setZIndexOffset(1000);

        // Open the selected marker's popup
        marker.openPopup();

        // Center the map on the selected marker with smooth animation
        if (props.selectedEvent?.coords) {
          map.setView(
            [props.selectedEvent.coords.lat, props.selectedEvent.coords.lng],
            12, // Zoom level
            { animate: true }
          );
        }
      } else {
        marker.setIcon(new L.Icon.Default());
        marker.setZIndexOffset(0);
        marker.closePopup();
      }
    });
  },
  { immediate: true }
);

// Clean up the map when component is unmounted
onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
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
