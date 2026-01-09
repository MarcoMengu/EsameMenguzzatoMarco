<template>
  <v-container>
    <v-row v-if="loading && !error" class="my-4 mt-8"> 
      <v-col v-for="n in itemsPerPage" :key="`placeholder-${n}`" cols="12" sm="6" md="4" class="d-flex justify-center"> 
        <v-card class="d-flex justify-center align-center" outlined disabled rounded="md" style="min-height: 270px; width: 100%; background-color: #333333;"> 
          <v-progress-circular indeterminate color="grey-darken-1" size="32" width="6"></v-progress-circular> 
        </v-card> 
      </v-col> 
    </v-row>

    <v-alert v-else-if="error" type="error">
      {{ error }}
    </v-alert>

    <div v-else-if="pokemons.length === 0" class="text-center py-12">
      <v-card class="mx-auto pa-8" max-width="500" elevation="0" color="transparent">
        <div class="text-center">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">
            mdi-pokeball
          </v-icon>
          <h3 class="text-h5 mb-4 text-grey-darken-1">
            Nessun Pokémon trovato
          </h3>
          <p class="text-body-1 text-grey mb-4">
            Ops! Sembra che questi Pokémon siano più timidi del solito. 
          </p>
        </div>
      </v-card>
    </div>

    <v-row v-else>
      <v-col
        v-for="pokemon in pokemons"
        :key="pokemon.id"
        cols="12"
        sm="6"
        md="4"
      >
        <PokemonCard 
          :pokemon="pokemon"
          @toggle-deck="$emit('toggleDeck', $event)"
          @show-details="$emit('showDetails', $event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import PokemonCard from './PokemonCard.vue';

defineProps({
  pokemons: {
    type: Array,
    required: true
  },
  loading: Boolean,
  error: String,
  itemsPerPage: {
    type: Number,
    default: 18
  }
});

defineEmits(['toggleDeck', 'showDetails']);
</script>