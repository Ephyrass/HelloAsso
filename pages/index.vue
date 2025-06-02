<template>
  <div class="events-page">
    <div class="page-header">
      <h1>Découvrez les événements près de chez vous</h1>
      <p class="subtitle">Filtrez par catégorie ou recherchez un événement spécifique</p>
    </div>

    <div class="mobile-tabs">
      <button :class="['tab-btn', { active: activeTab === 'list' }]" @click="activeTab = 'list'">
        Liste d'événements
      </button>
      <button :class="['tab-btn', { active: activeTab === 'map' }]" @click="activeTab = 'map'">
        Carte
      </button>
    </div>

    <div class="events-layout">
      <div
        class="events-list-container"
        :class="{ 'mobile-hidden': isMobile && activeTab === 'map' }"
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
          :class="{ 'mobile-hidden': isMobile && activeTab === 'list' }"
        >
          <EventMap />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useEventStore } from '~/stores/eventStore'

const eventStore = useEventStore()
const activeTab = ref('list')
const isMobile = ref(false)

function checkIsMobile() {
  isMobile.value = window.innerWidth <= 1024
}

onMounted(() => {
  eventStore.fetchEvents()

  checkIsMobile()

  window.addEventListener('resize', checkIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style>
.events-page {
  padding: var(--spacing-lg);
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 25px auto;
  width: 100%;
}

.page-header {
  margin-bottom: var(--spacing-lg);
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.page-header h1 {
  color: var(--color-secondary);
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  color: var(--color-grey-dark);
  font-size: 1.1rem;
}

.section-title {
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
  font-size: 1.4rem;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
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
  border-radius: var(--border-radius-md);
  background-color: white;
  box-shadow: var(--shadow-md);
  padding: var(--spacing-md);
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
  margin-bottom: var(--spacing-lg);
}

.events-map-container {
  flex: 1;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

/* Custom scrollbar */
.events-list-container::-webkit-scrollbar {
  width: 8px;
}

.events-list-container::-webkit-scrollbar-track {
  background: var(--color-light);
  border-radius: var(--border-radius-sm);
}

.events-list-container::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: var(--border-radius-sm);
}

.events-list-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-secondary);
}

/* Styles pour les onglets mobiles */
.mobile-tabs {
  display: none;
  margin-bottom: var(--spacing-md);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.tab-btn {
  width: 50%;
  padding: 12px;
  background: #f5f5f5;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-secondary);
}

.tab-btn.active {
  background: var(--color-primary);
  color: white;
}

.mobile-hidden {
  display: none !important;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .events-page {
    padding: var(--spacing-md);
  }

  .events-list-container {
    width: 320px;
  }
}

@media (max-width: 1024px) {
  .events-layout {
    flex-direction: column;
  }

  .events-list-container {
    width: 100%;
    height: 300px;
  }

  .events-map-container {
    height: 400px;
  }

  .mobile-tabs {
    display: flex;
  }

  .events-list-container {
    height: calc(100vh - 300px);
  }

  .events-map-container {
    height: calc(100vh - 300px);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding-top: 60px;
  }
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
    margin: var(--spacing-md) auto;
    padding: var(--spacing-sm);
  }

  .events-list-container {
    height: 250px;
  }

  .events-map-container {
    height: 350px;
  }

  .events-list-container {
    height: calc(100vh - 250px);
  }

  .events-map-container {
    height: calc(100vh - 250px);
  }
}

@media (max-width: 480px) {
  .page-header {
    padding-top: 50px;
  }

  .page-header h1 {
    font-size: 1.4rem;
    margin-bottom: var(--spacing-xs);
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .events-list-container {
    height: 200px;
    padding: var(--spacing-sm);
  }

  .events-map-container {
    height: 300px;
  }

  .events-list-container {
    height: calc(100vh - 220px);
  }

  .events-map-container {
    height: calc(100vh - 220px);
  }
}

/* Style normal pour les deux conteneurs, sans le toggle sur grand écran */
@media (min-width: 1025px) {
  .events-list-container,
  .events-map-container {
    display: block !important; /* Force l'affichage sur grand écran */
  }
}
</style>
