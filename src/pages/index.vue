<template>
  <v-app>
    <HeaderComponent
      v-model:searchTerm="searchTerm"
      v-model:selectedType="selectedType"
      :types="types"
      :is-showing-only-my-pokemon="showOnlyMyPokemon"
      @toggle-view="handleToggleView"
    />

    <v-main>
      <v-container>
        <PokemonCounter
          :my-count="myFilteredPokemonCount"
          :total-count="totalFilteredPokemon"
        />

        <PokemonList
          :pokemons="paginatedPokemon"
          :loading="isLoading"
          :error="error"
          :items-per-page="18"
          @toggle-deck="handleToggleDeck"
          @show-details="handleShowDetails"
        />

        <PaginationComponent
          :current-page="currentPage"
          :total-pages="totalPages"
          @change-page="changePage"
        />
      </v-container>
    </v-main>

    <PokemonDetailsDialog
      v-model:show="isDialogVisible"
      :pokemon="pokemonForDialog"
      :evolution-chain="selectedPokemonEvolutionChain"
      :loading="selectedPokemonDetails.loading"
      :error="selectedPokemonDetails.error"
      :can-navigate-previous="canNavigatePrevious"
      :can-navigate-next="canNavigateNext"
      @toggle-deck="handleToggleDeck"
      @show-details="handleShowDetails"
      @navigate-previous="navigateToPreviousPokemon"
      @navigate-next="navigateToNextPokemon"
    />

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
      location="bottom"
      class="snackbar-margin text-center"
    >
      <span v-html="snackbar.message"></span>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePokemon } from '@/composables/usePokemon';

import HeaderComponent from '@/components/HeaderComponent.vue';
import PokemonCounter from '@/components/PokemonCounter.vue';
import PokemonList from '@/components/PokemonList.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import PokemonDetailsDialog from '@/components/PokemonDetailsDialog.vue';

const {
  paginatedPokemon,
  pokemonToDisplay,
  isLoading,
  error,
  types,
  searchTerm,
  selectedType,
  showOnlyMyPokemon,
  currentPage,
  totalPages,
  myFilteredPokemonCount,
  totalFilteredPokemon,
  selectedPokemonDetails,
  selectedPokemonEvolutionChain,
  snackbar,
  canNavigatePrevious,
  canNavigateNext,
  togglePokemonInDeck,
  toggleShowOnlyMyPokemon,
  fetchPokemonDetails,
  navigateToPreviousPokemon,
  navigateToNextPokemon,
  changePage
} = usePokemon();

const isDialogVisible = ref(false);
const pokemonForDialog = computed(() => {
  if (!selectedPokemonDetails.data) return null;
  const mainPokemon = pokemonToDisplay.value.find(p => p.id === selectedPokemonDetails.data.id);
  return {
    ...selectedPokemonDetails.data,
    isAddedToDeck: mainPokemon ? mainPokemon.isAddedToDeck : false
  };
});

const handleToggleView = () => {
  toggleShowOnlyMyPokemon();
};

const handleToggleDeck = (pokemon) => {
  togglePokemonInDeck(pokemon);
};

const handleShowDetails = async (pokemonId) => {
  await fetchPokemonDetails(pokemonId);
  isDialogVisible.value = true;
};
</script>

<style scoped>
.snackbar-margin {
  margin-bottom: 20px;
}
</style>
