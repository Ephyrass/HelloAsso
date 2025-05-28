<template>
  <div class="event-list">
    <div v-if="loading" class="loading">
      Chargement des événements...
    </div>
    <div v-else-if="events.length === 0" class="no-events">
      Aucun événement trouvé.
    </div>
    <div
      v-else
      v-for="event in events"
      :key="event.id"
      :class="['event-item', { 'selected': isSelected(event) }]"
      @click="$emit('select', event)"
      :ref="el => { if (isSelected(event)) selectedItemRef = el as HTMLElement }"
    >
      <h3>{{ event.title }}</h3>
      <div class="category-badge">{{ event.category }}</div>
      <p>{{ event.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { Event } from '~/types/Event';

const props = defineProps<{
  events: Event[];
  loading: boolean;
  selectedEvent: Event | null;
}>();

defineEmits<{
  'select': [event: Event];
}>();

const selectedItemRef = ref<HTMLElement | null>(null);

function isSelected(event: Event): boolean {
  return !!props.selectedEvent && props.selectedEvent.id === event.id;
}

// Faire défiler vers l'élément sélectionné
watch(() => props.selectedEvent, async () => {
  if (props.selectedEvent) {
    await nextTick();
    if (selectedItemRef.value && typeof selectedItemRef.value.scrollIntoView === 'function') { // add typeof for testing purpose on scrollIntoView
      selectedItemRef.value.scrollIntoView({ behavior: 'smooth' });
    }
  }
}, { immediate: true });
</script>

<style scoped>
.event-list {
  padding: 5px;
}

.event-item {
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid transparent;
}

.event-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.event-item.selected {
  background-color: #e8f7f5;
  border-left: 4px solid #2A9D8F;
  box-shadow: 0 4px 12px rgba(42, 157, 143, 0.2);
}

.event-item h3 {
  margin-bottom: 8px;
  color: #264653;
  font-size: 1.1rem;
}

.event-item p {
  color: #666;
  font-size: 0.95rem;
  margin-top: 8px;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-badge {
  display: inline-block;
  background-color: #E9C46A;
  color: #333;
  font-weight: 500;
  border-radius: 30px;
  padding: 4px 10px;
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.loading, .no-events {
  padding: 30px;
  text-align: center;
  color: #666;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-top: 10px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading:before {
  content: "";
  width: 30px;
  height: 30px;
}
</style>
