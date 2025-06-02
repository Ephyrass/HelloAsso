<template>
  <div class="filters-container">
    <div class="filter-section">
      <h3 class="filter-title">Recherche</h3>
      <div class="search-container">
        <div class="search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          v-model="searchInput"
          placeholder="Rechercher un événement..."
          @input="updateSearch"
          class="search-input"
        />
        <button v-if="searchInput" @click="clearSearch" class="clear-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="filter-section">
      <h3 class="filter-title">Catégories</h3>
      <div class="categories-list">
        <div
          v-for="category in eventStore.categories"
          :key="category"
          :class="['category-chip', { selected: isSelected(category) }]"
          @click="toggleCategory(category)"
        >
          {{ capitalizeFirstLetter(category) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useEventStore } from '~/stores/eventStore'

const eventStore = useEventStore()

const searchInput = ref(eventStore.searchQuery || '')
const selectedCategoriesInput = ref<string[]>([...(eventStore.selectedCategories ?? [])])

// Initialize on mount
onMounted(() => {
  if (eventStore.selectedCategories) {
    selectedCategoriesInput.value = [...eventStore.selectedCategories]
  }
})

// Synchronize input values with store
watch(
  () => eventStore.searchQuery,
  (newValue) => {
    searchInput.value = newValue || ''
  }
)

watch(
  () => eventStore.selectedCategories,
  (newValue) => {
    if (newValue) {
      // Create a new reference to force reactivity
      selectedCategoriesInput.value = [...newValue]
    } else {
      selectedCategoriesInput.value = []
    }
  },
  { deep: true }
)

function updateSearch() {
  eventStore.searchQuery = searchInput.value
}

function clearSearch() {
  searchInput.value = ''
  eventStore.searchQuery = ''
}

function isSelected(category: string): boolean {
  return eventStore.selectedCategories.includes(category)
}

function toggleCategory(category: string) {
  const index = selectedCategoriesInput.value.indexOf(category)
  if (index === -1) {
    selectedCategoriesInput.value.push(category)
  } else {
    selectedCategoriesInput.value.splice(index, 1)
  }
  eventStore.selectedCategories = [...selectedCategoriesInput.value]
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>

<style scoped>
.filters-container {
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  gap: 20px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
}

.filter-title {
  color: #264653;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #777;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 38px;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f9f9f9;
}

.search-input:focus {
  outline: none;
  border-color: #2a9d8f;
  box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.2);
  background-color: white;
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background-color: #f1f1f1;
  color: #333;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
}

.category-chip {
  background-color: #f1f1f1;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.category-chip:hover {
  background-color: #e4e4e4;
}

.category-chip.selected {
  background-color: #2a9d8f;
  color: white;
  border-color: #2a9d8f;
  box-shadow: 0 2px 4px rgba(42, 157, 143, 0.3);
}

@media (max-width: 768px) {
  .filters-container {
    padding: 15px;
    flex-direction: column;
  }

  .category-chip {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>
