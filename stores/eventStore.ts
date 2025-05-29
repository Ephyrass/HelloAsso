import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Event } from '~/types/Event';

export const useEventStore = defineStore('event', () => {
  const events = ref<Event[]>([]);
  const loading = ref(true);
  const searchQuery = ref('');
  const selectedCategories = ref<string[]>([]);
  const selectedEvent = ref<Event | null>(null);
  const categories = ref<string[]>([]);
  
  // Flag to avoid URL updates during initial loading
  const isInitialLoad = ref(true);

  const route = useRoute();
  const router = useRouter();

  // Computed for filtered events with memoization
  const filteredEvents = computed(() => {
    const query = searchQuery.value.toLowerCase();
    
    return events.value.filter((event) => {
      const matchesSearch = !query || 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategories.value.length === 0 || 
        selectedCategories.value.includes(event.category);

      return matchesSearch && matchesCategory;
    });
  });

  // Initialize filters from URL
  function initFromRoute() {
    if (route.query.search) {
      searchQuery.value = route.query.search as string;
    }

    if (route.query.categories) {
      if (Array.isArray(route.query.categories)) {
        selectedCategories.value = route.query.categories as string[];
      } else {
        selectedCategories.value = [route.query.categories as string];
      }
    }
  }

  // Update URL when filters change
  function updateRouteFromState() {
    if (isInitialLoad.value) return;

    const query: Record<string, string | string[]> = {};
    
    if (searchQuery.value) query.search = searchQuery.value;
    if (selectedCategories.value.length > 0) query.categories = selectedCategories.value;
    if (selectedEvent.value) query.eventId = String(selectedEvent.value.id);

    router.replace({ query });
  }

  // Watch filter changes to update URL
  watch([searchQuery, selectedCategories, selectedEvent], updateRouteFromState, { deep: true });

  // Watch URL changes to update filters
  watch(() => route.query, initFromRoute, { immediate: true });

  async function fetchEvents() {
    loading.value = true;
    
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      events.value = data;

      // Extract unique categories
      categories.value = [...new Set(data.map((event: Event) => event.category))] as string[];
      // Restore selected event from URL
      if (route.query.eventId) {
        const eventId = String(route.query.eventId);
        selectedEvent.value = events.value.find((e) => String(e.id) === eventId) || null;
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      loading.value = false;
      // Mark the end of initial loading
      isInitialLoad.value = false;
    }
  }

  function selectEvent(event: Event) {
    selectedEvent.value = event;
  }

  return {
    events,
    loading,
    searchQuery,
    selectedCategories,
    selectedEvent,
    categories,
    filteredEvents,
    fetchEvents,
    selectEvent,
  };
});
