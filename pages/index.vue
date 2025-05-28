<template>
  <div class="events-page">
    <h1>Événements</h1>

    <EventFilters
      v-model:search="searchQuery"
      v-model:category="selectedCategory"
      :categories="categories"
    />

    <div class="events-layout">
      <div class="events-list-container">
        <EventList
          :events="filteredEvents"
          :loading="loading"
          :selectedEvent="selectedEvent"
          @select="selectEvent"
        />
      </div>

      <div class="events-map-container">
        <EventMap
          :events="filteredEvents"
          :selectedEvent="selectedEvent"
          @select="selectEvent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useEvents } from '~/composables/useEvents';

// Initialiser le composable
const {
  events,
  loading,
  searchQuery,
  selectedCategory,
  selectedEvent,
  categories,
  filteredEvents,
  fetchEvents,
  selectEvent
} = useEvents();

// Charger les événements au montage du composant
onMounted(() => {
  fetchEvents();
});
watch(() => events.value, (newEvents) => {
  console.log('Événements mis à jour:', newEvents);
});

watch(() => filteredEvents.value, (newFiltered) => {
  console.log('Événements filtrés:', newFiltered);
});

</script>

<style>
.events-page {
  padding: 20px;
}

.events-layout {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.events-list-container {
  flex: 1;
  max-width: 400px;
  height: 70vh;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.events-map-container {
  flex: 2;
  height: 70vh;
}

.map-container {
  height: 100%;
}
</style>