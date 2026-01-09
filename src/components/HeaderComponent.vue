<template>
  <v-container fluid class="d-flex flex-column"> 
    <v-row align="center" style="background-color: #303030; border-radius: 8px 8px 0 0;">
      <v-col class="d-flex justify-center justify-md-start">
        <v-img src="/logo.png" alt="PokéDeck UniTn Logo" contain height="100"></v-img>
      </v-col>
    </v-row> 
    <v-row align="center" style="position: sticky; top: 0; z-index: 100; background-color: #303030; border-radius: 0 0 8px 8px;"> 
      <v-col cols="12" sm="4" md="4">
        <v-btn 
          :color="isShowingOnlyMyPokemon ? '#C62828' : 'grey-lighten-1'" 
          variant="elevated"
          :prepend-icon="isShowingOnlyMyPokemon ? 'mdi-arrow-left' : 'mdi-cards-outline'"
          block 
          height="40px" 
          class="pokemon-toggle-btn"
          @click="$emit('toggle-view')"
        >
          {{ isShowingOnlyMyPokemon ? 'TUTTI I POKEMON' : 'I MIEI POKEMON' }}
        </v-btn>
      </v-col> 
      <v-col cols="12" sm="4" md="4">
        <v-text-field 
          :model-value="searchTerm" 
          @update:model-value="$emit('update:searchTerm', $event)"
          @click:clear="$emit('update:searchTerm', '')"
          label="Filtra per nome o per #ID" 
          prepend-inner-icon="mdi-magnify" 
          @keydown.enter="$emit('apply-filter')" 
          variant="outlined" 
          density="compact" 
          clearable 
          hide-details
          block
          height="40px"
          class="w-100"
        ></v-text-field>
      </v-col> 
      <v-col cols="12" sm="4" md="4">
        <v-select 
          :model-value="selectedType" 
          @update:model-value="$emit('update:selectedType', $event)"
          :items="capitalizedTypes" 
          item-title="displayName"
          item-value="name"
          label="Filtra per tipo" 
          prepend-inner-icon="mdi-pokeball" 
          variant="outlined" 
          density="compact" 
          clearable 
          hide-details 
          @update:modelValue="$emit('apply-filter')"
        ></v-select>
      </v-col>     
    </v-row> 
    <v-row v-if="loading && !error" class="my-4"> 
      <v-col key="`placeholder-${n}`" cols="12" sm="6" md="4" lg="3" class="d-flex justify-center"> 
        <v-card class="ma-4 d-flex justify-center align-center" width="320" height="384" outlined disabled rounded="lg">
          <v-progress-circular indeterminate color="grey-darken-1" size="32" width="6"></v-progress-circular>
        </v-card> 
      </v-col> 
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue';
import { translateType } from '@/utils/pokemonUtils';

const props = defineProps({
  searchTerm: String,
  selectedType: String,
  types: Array,
  isShowingOnlyMyPokemon: Boolean,
  loading: Boolean,
  error: String
});

const capitalizedTypes = computed(() => {
  return props.types
    .filter(type => type.name !== 'stellar' && type.name !== 'unknown')
    .map(type => ({
      ...type,
      name: type.name, // Mantiene il valore originale inglese per il filtro
      displayName: translateType(type.name) // Nome tradotto per la visualizzazione
    }));
});

defineEmits(['update:searchTerm', 'update:selectedType', 'toggle-view', 'apply-filter']);
</script>

<style scoped>
.v-text-field, .v-select {
  width: 100%;
}

.pokemon-toggle-btn:hover {
  background-color: rgba(239, 83, 80, 0.6) !important;
  transition: background-color 0.3s ease;
}
</style>