<template>
  <div class="events-page">
    <div class="page-header">
      <h1>Découvrez les événements près de chez vous</h1>
      <p class="subtitle">Filtrez par catégorie ou recherchez un événement spécifique</p>
    </div>

    <div class="events-layout">
      <div class="events-list-container">
        <h2 class="section-title">Événements</h2>
        <EventList
          :events="eventStore.filteredEvents"
          :loading="eventStore.loading"
          :selectedEvent="eventStore.selectedEvent"
          @select="eventStore.selectEvent"
        />
      </div>

      <div class="events-right-container">
        <div class="events-search-container">
          <EventFilters
              :search="eventStore.searchQuery"
              :categories="eventStore.categories"
              :selectedCategories="eventStore.selectedCategories"
              @update:search="eventStore.searchQuery = $event"
              @update:selectedCategories="eventStore.selectedCategories = $event"
          />
        </div>

        <div class="events-map-container">
          <EventMap
            :events="eventStore.filteredEvents"
            :selectedEvent="eventStore.selectedEvent"
            @select="eventStore.selectEvent"
            :loading="eventStore.loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useEventStore } from '~/stores/eventStore';

const eventStore = useEventStore();

onMounted(() => {
  eventStore.fetchEvents();
});
</script>

<style>
.events-page {
  padding: 20px;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
  text-align: center;
  padding: 20px 0;
}

.page-header h1 {
  color: #264653;
  font-size: 2rem;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.section-title {
  color: #264653;
  margin-bottom: 15px;
  font-size: 1.4rem;
  border-bottom: 2px solid #2A9D8F;
  padding-bottom: 8px;
}

.events-layout {
  display: flex;
  gap: 25px;
  flex: 1;
  overflow: hidden;
}

.events-list-container {
  width: 380px;
  height: calc(100vh - 200px);
  overflow-y: auto;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 15px;
}

.events-right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.events-search-container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.events-map-container {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Scrollbar personnalisée */
.events-list-container::-webkit-scrollbar {
  width: 8px;
}

.events-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.events-list-container::-webkit-scrollbar-thumb {
  background: #2A9D8F;
  border-radius: 4px;
}

.events-list-container::-webkit-scrollbar-thumb:hover {
  background: #264653;
}

/* Responsive */
@media (max-width: 1024px) {
  .events-layout {
    flex-direction: column;
  }

  .events-list-container {
    width: 100%;
    height: 300px;
  }
}
</style>
