<template>
  <div v-if="totalPages > 1" class="text-center my-4">
    <v-pagination
      :model-value="currentPage"
      @update:model-value="$emit('changePage', $event)"
      :length="totalPages"
      :total-visible="7"
    ></v-pagination>
  </div>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number
});
defineEmits(['changePage']);
</script>