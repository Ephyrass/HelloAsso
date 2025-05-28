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

  // Sauvegarder les paramètres initiaux de l'URL
  function saveInitialQueryParams() {
    initialQueryParams.value = { ...route.query };
  }

  // Initialiser les filtres depuis l'URL au chargement
  watch(() => route.query, (query) => {

    // Gestion des catégories comme tableau
    if (query.categories) {
      if (Array.isArray(query.categories)) {
        selectedCategories.value = query.categories as string[];
      } else {
        selectedCategories.value = [query.categories as string];
      }
    } else {
      selectedCategories.value = [];
    }

    // La sélection d'événement sera traitée après le chargement des données
  }, { immediate: true });

  // Mettre à jour l'URL quand les filtres changent, mais seulement après le chargement initial
  watch([searchQuery, selectedCategories, selectedEvent], () => {
    // Ne pas mettre à jour l'URL pendant le chargement
    if (loading.value) return;

    const query: Record<string, string | string[]> = {};
    if (searchQuery.value) query.search = searchQuery.value;
    if (selectedCategories.value.length > 0) query.categories = selectedCategories.value;
    if (selectedEvent.value) query.eventId = String(selectedEvent?.value?.id);

    router.replace({ query });
  }, { deep: true });

  // Surveiller les événements pour appliquer les filtres initiaux après chargement
  watch(() => events.value, (newEvents) => {
    if (newEvents.length > 0 && initialQueryParams.value.eventId) {
      const eventId = String(initialQueryParams.value.eventId);
      const event = newEvents.find(e => String(e.id) === eventId);
      if (event) selectedEvent.value = event;
      // Réinitialiser pour ne pas rappliquer à chaque changement d'événements
      initialQueryParams.value = {};
    }
  }, { deep: true });

  const filteredEvents = computed(() => {
    return events.value.filter(event => {
      const matchesSearch = !searchQuery.value ||
          event.title.toLowerCase().includes(searchQuery.value.toLowerCase());

      // Vérifier si aucune catégorie n'est sélectionnée ou si l'événement appartient à l'une des catégories sélectionnées
      const matchesCategory = selectedCategories.value.length === 0 ||
          selectedCategories.value.includes(event.category);

      return matchesSearch && matchesCategory;
    });
  });

  async function fetchEvents() {
    loading.value = true;
    // Sauvegarder les paramètres d'URL au début du chargement
    saveInitialQueryParams();

    try {
      const response = await fetch('/api/events');
      events.value = await response.json();

      // Extraire les catégories uniques
      const uniqueCategories = new Set<string>();
      events.value.forEach(event => uniqueCategories.add(event.category));
      categories.value = Array.from(uniqueCategories);

      // Restaurer l'événement sélectionné depuis l'URL si nécessaire
      if (route.query.eventId) {
        const eventId = String(route.query.eventId);
        const event = events.value.find(e => String(e.id) === eventId);
        if (event) selectedEvent.value = event;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
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
    selectEvent
  };
});
