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
  const initialQueryParams = ref<Record<string, any>>({});

  const route = useRoute();
  const router = useRouter();

  // Save initial URL parameters
  function saveInitialQueryParams() {
    initialQueryParams.value = { ...route.query };
  }

  // Initialize filters from URL on load
  watch(
    () => route.query,
    (query) => {
      if (query.search) {
        searchQuery.value = query.search as string;
      } else {
        searchQuery.value = '';
      }

      // Handle categories as array
      if (query.categories) {
        if (Array.isArray(query.categories)) {
          selectedCategories.value = query.categories as string[];
        } else {
          selectedCategories.value = [query.categories as string];
        }
      } else {
        selectedCategories.value = [];
      }

      // Event selection will be processed after data loading
    },
    { immediate: true }
  );

  // Update URL when filters change, but only after initial loading
  watch(
    [searchQuery, selectedCategories, selectedEvent],
    () => {
      // Don't update URL during loading
      if (loading.value) return;

      const query: Record<string, string | string[]> = {};
      if (searchQuery.value) query.search = searchQuery.value;
      if (selectedCategories.value.length > 0) query.categories = selectedCategories.value;
      if (selectedEvent.value) query.eventId = String(selectedEvent?.value?.id);

      router.replace({ query });
    },
    { deep: true }
  );

  // Watch events to apply initial filters after loading
  watch(
    () => events.value,
    (newEvents) => {
      if (newEvents.length > 0 && initialQueryParams.value.eventId) {
        const eventId = String(initialQueryParams.value.eventId);
        const event = newEvents.find((e) => String(e.id) === eventId);
        if (event) selectedEvent.value = event;
        // Reset to avoid reapplying on every event change
        initialQueryParams.value = {};
      }
    },
    { deep: true }
  );

  const filteredEvents = computed(() => {
    return events.value.filter((event) => {
      const matchesSearch =
        !searchQuery.value || event.title.toLowerCase().includes(searchQuery.value.toLowerCase());

      // Check if no category is selected or if the event belongs to one of the selected categories
      const matchesCategory =
        selectedCategories.value.length === 0 || selectedCategories.value.includes(event.category);

      return matchesSearch && matchesCategory;
    });
  });

  async function fetchEvents() {
    loading.value = true;
    // Save URL parameters at the beginning of loading
    saveInitialQueryParams();

    try {
      const response = await fetch('/api/events');
      events.value = await response.json();

      // Extract unique categories
      const uniqueCategories = new Set<string>();
      events.value.forEach((event) => uniqueCategories.add(event.category));
      categories.value = Array.from(uniqueCategories);

      // Restore selected event from URL if needed
      if (route.query.eventId) {
        const eventId = String(route.query.eventId);
        const event = events.value.find((e) => String(e.id) === eventId);
        if (event) selectedEvent.value = event;
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      loading.value = false;
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
