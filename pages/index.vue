<template>
  <div class="events-page">
    <div class="page-header">
      <h1>Découvrez les événements près de chez vous</h1>
      <p class="subtitle">Filtrez par catégorie ou recherchez un événement spécifique</p>
    </div>

    <div class="mobile-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'list' }]" 
        @click="activeTab = 'list'"
      >
        Liste d'événements
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'map' }]" 
        @click="activeTab = 'map'"
      >
        Carte
      </button>
    </div>

    <div class="events-layout">
      <div 
        class="events-list-container"
        :class="{ 'mobile-hidden': activeTab === 'map' }"
      >
        <h2 class="section-title">Événements</h2>
        <EventList />
      </div>

      <div class="events-right-container">
        <div class="events-search-container">
          <EventFilters />
        </div>

        <div 
          class="events-map-container"
          :class="{ 'mobile-hidden': activeTab === 'list' }"
        >
          <EventMap />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEventStore } from '~/stores/eventStore'

const eventStore = useEventStore()
const activeTab = ref('list') // Par défaut, afficher la liste sur mobile

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

/* Styles pour la bascule sur mobile */
.mobile-tabs {
  display: none;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  width: 50%;
  padding: 12px;
  background: #f5f5f5;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  color: #264653;
}

.tab-btn.active {
  background: #2a9d8f;
  color: white;
}

.mobile-hidden {
  display: none !important;
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
  .mobile-tabs {
    display: flex;
  }
  
  .events-layout {
    flex-direction: column;
  }

  .events-list-container,
  .events-map-container {
    width: 100%;
    height: calc(100vh - 300px);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding-top: 50px;
  }
  .page-header h1 {
    font-size: 1.6rem;
margin-bottom: 5px; }

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

  .events-list-container,
  .events-map-container {
    height: calc(100vh - 270px);
  }
}

@media (max-width: 480px) {


  .page-header h1 {
    font-size: 1.4rem;
    margin-bottom: 5px;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .events-list-container {
    height: 300px;
    padding: 10px;
  }

  .events-map-container {
    height: calc(100vh - 250px);
  }
}
</style>
