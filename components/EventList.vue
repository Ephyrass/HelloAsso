<template>
  <div class="event-list">
    <div v-if="eventStore.loading" class="loading">Chargement des événements...</div>
    <div v-else-if="eventStore.filteredEvents.length === 0" class="no-events">
      Aucun événement trouvé.
    </div>
    <div
      v-else
      v-for="event in eventStore.filteredEvents"
      :key="event.id"
      :class="['event-item', { selected: isSelected(event) }]"
      @click="eventStore.selectEvent(event)"
      :ref="
        (el) => {
          if (isSelected(event)) selectedItemRef = el as HTMLElement
        }
      "
    >
      <h3>{{ event.title }}</h3>
      <div class="category-badge">{{ event.category }}</div>
      <p>{{ event.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useEventStore } from '~/stores/eventStore'
import type { Event } from '~/types/Event'

const eventStore = useEventStore()
const selectedItemRef = ref<HTMLElement | null>(null)

function isSelected(event: Event): boolean {
  return !!eventStore.selectedEvent && eventStore.selectedEvent.id === event.id
}

// Scroll to selected item
watch(
  () => eventStore.selectedEvent,
  async () => {
    if (eventStore.selectedEvent) {
      await nextTick()
      if (selectedItemRef.value && typeof selectedItemRef.value.scrollIntoView === 'function') {
        // add typeof for testing purpose on scrollIntoView
        selectedItemRef.value.scrollIntoView({ behavior: 'smooth' })
      }
    }
  },
  { immediate: true }
)
</script>

