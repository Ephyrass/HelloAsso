<template>
  <div class="events-page">
    <div class="page-header">
      <h1>Découvrez les événements près de chez vous</h1>
      <p class="subtitle">Filtrez par catégorie ou recherchez un événement spécifique</p>
    </div>

    <div class="events-layout">
      <div class="events-list-container">
        <h2 class="section-title">Événements</h2>
        <EventList />
      </div>

      <div class="events-right-container">
        <div class="events-search-container">
          <EventFilters />
        </div>

        <div class="events-map-container">
          <EventMap />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useEventStore } from '~/stores/eventStore'

const eventStore = useEventStore()

onMounted(() => {
  eventStore.fetchEvents()
})
</script>

<style>
.events-page {
  padding: 20px;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 25px auto;
  width: 100%;
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
  border-bottom: 2px solid #2a9d8f;
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

/* Custom scrollbar */
.events-list-container::-webkit-scrollbar {
  width: 8px;
}

.events-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.events-list-container::-webkit-scrollbar-thumb {
  background: #2a9d8f;
  border-radius: 4px;
}

.events-list-container::-webkit-scrollbar-thumb:hover {
  background: #264653;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .events-page {
    padding: 15px;
  }

  .events-list-container {
    width: 320px;
  }
}

@media (max-width: 1024px) {
  .events-layout {
    flex-direction: column;
    gap: 18px;
  }

  .events-list-container {
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
  }

  .events-map-container {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .events-page {
    margin: 15px auto;
    padding: 10px;
  }

  .events-list-container {
    height: 250px;
    padding: 10px;
  }

  .events-map-container {
    height: 350px;
  }
}

@media (max-width: 600px) {
  .events-layout {
    gap: 10px;
  }
  .events-list-container {
    height: 180px;
    padding: 7px;
  }
  .events-map-container {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 10px 0;
  }

  .page-header h1 {
    font-size: 1.4rem;
    margin-bottom: 5px;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .events-list-container {
    height: 120px;
    padding: 5px;
  }

  .events-map-container {
    height: 140px;
  }
}
</style>
