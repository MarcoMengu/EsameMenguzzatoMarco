<template>
  <v-container class="text-center py-4">
    <div v-if="loading">
      <v-skeleton-loader
        type="text"
        class="mb-2"
        width="300px"
        style="margin: 0 auto;"
      ></v-skeleton-loader>
      <v-skeleton-loader
        type="divider"
        height="10px"
        class="rounded"
      ></v-skeleton-loader>
    </div>
    <div v-else-if="totalCount > 0">
      <p class="text-h6">
        Hai catturato {{ myCount }} Pokémon su {{ totalCount }}
        {{ totalCount === 1 ? 'disponibile' : 'disponibili' }}.
      </p>
      <v-progress-linear
        :model-value="(myCount / totalCount) * 100"
        color="grey-lighten-1"
        height="10"
        rounded
      ></v-progress-linear>
    </div>
  </v-container>
</template>

<script setup>
defineProps({
  myCount: {
    type: Number,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>