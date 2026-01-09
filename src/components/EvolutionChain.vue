<template>
  <div>
    <h3 class="text-h6 mt-4 text-center">Catena Evolutiva</h3>
    <div v-if="error" class="text-center py-4 text-red">
      {{ error }}
    </div>
    <div v-else-if="evolutionStages.length > 0" class="d-flex align-center justify-center flex-wrap ga-2 my-4">
      <template v-for="(stage, stageIndex) in evolutionStages" :key="`stage-${stageIndex}`">
        <div class="d-flex flex-column align-center">
          <div 
            v-for="evolutionInGroup in stage" 
            :key="evolutionInGroup.id" 
            class="text-center evolution-pokemon"
            @click="$emit('pokemonClick', evolutionInGroup.id)"
          >
            <v-avatar 
              size="80" 
              class="elevation-2 evolution-chip"
              :class="{ 'current-pokemon': evolutionInGroup.id == currentPokemonId }"
            >
              <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionInGroup.id}.png`" :alt="evolutionInGroup.name">
            </v-avatar>
            <p class="text-capitalize mt-1">{{ evolutionInGroup.name }}</p>
          </div>
        </div>
        <v-icon v-if="stageIndex < evolutionStages.length - 1" class="mx-4">
          mdi-arrow-right-thick
        </v-icon>
      </template>
    </div>
    <div v-else class="text-center py-4 text-grey">
      Nessuna catena evolutiva trovata per questo Pokémon.
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  evolutionStages: Array,
  loading: Boolean,
  error: String,
  currentPokemonId: Number,
  currentPokemonTypes: Array,
});
defineEmits(['pokemonClick']);
</script>

<style scoped>
.evolution-pokemon {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.evolution-pokemon:hover {
  transform: scale(1.1);
}

.evolution-chip {
  background-color: #424242 !important; 
}

.current-pokemon {
  border: 3px solid #808080 !important;
  box-shadow: 0 0 15px 5px #808080 !important;
}
</style>