<template>
  <v-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" max-width="750px" max-height="565px" scrim="rgba(0, 0, 0, 1)">
    <v-card style="position: relative;">
      <v-btn
        v-if="canNavigatePrevious"
        icon
        size="large"
        variant="text"
        flat
        class="navigation-btn"
        style="position: absolute; left: 5px; top: 50%; transform: translateY(-50%); z-index: 1000;"
        @click="$emit('navigatePrevious')"
        :disabled="loading"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        v-if="canNavigateNext"
        icon
        size="large"
        variant="text"
        flat
        class="navigation-btn"
        style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); z-index: 1000;"
        @click="$emit('navigateNext')"
        :disabled="loading"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <div v-if="error && !pokemon">
        <v-card-title>Informazioni non Disponibili</v-card-title>
        <v-card-text>
          <p>Non è stato possibile caricare i dettagli per il Pokémon selezionato.</p>
          <p class="text-red">{{ error }}</p>
          <p>Potrebbe esserci un problema di connessione o il Pokémon non esiste.</p>
        </v-card-text>
      </div>
      <template v-if="pokemon">
        <v-card-title class="text-h5 text-capitalize d-flex justify-space-between align-center">
          <span>{{ pokemon.name }} #{{ pokemon.id }}</span>
          <v-btn
            :color="pokemon.isAddedToDeck ? 'red-lighten-2' : 'green-lighten-2'"
            variant="outlined"
            @click="handleToggleDeck"
            :disabled="loading"
            :style="{ color: pokemon.isAddedToDeck ? '#ef5350' : '#66bb6a' }"
          >
            <v-icon
              :icon="pokemon.isAddedToDeck ? 'mdi-minus-circle' : 'mdi-plus-circle-outline'"
              size="small"
              class="mr-1"
            ></v-icon>
            {{ pokemon.isAddedToDeck ? 'Rimuovi' : 'Aggiungi' }}
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" class="text-center">
              <v-img :src="pokemon.sprites.front_default" height="150px" contain></v-img>
              <div>
                <strong>{{ pokemon.types.length > 1 ? 'Tipi' : 'Tipo' }}</strong>
                <div class="d-flex justify-center ga-2 mt-2">
                  <v-chip 
                    v-for="t in pokemon.types" 
                    :key="t.type.name" 
                    color="white"
                    class="text-capitalize"
                    rounded="lg"
                  >
                    {{ translateType(t.type.name) }}
                  </v-chip>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="d-flex flex-column my-4 mb-12">
                  <span class="d-flex align-center mb-2"><v-icon class="mr-2">mdi-human-male-height</v-icon> Altezza: {{ pokemon.height / 10 }} m</span>
                  <span class="d-flex align-center"><v-icon class="mr-2">mdi-weight-kilogram</v-icon> Peso: {{ pokemon.weight / 10 }} kg</span>
              </div>
              <div class="mb-4">
                <strong class="mb-2 d-block text-center">Abilità</strong>
                <div class="d-flex flex-column ga-2 align-center">
                  <v-chip
                    v-for="a in pokemon.abilities"
                    :key="a.ability.name"
                    color="blue-grey-lighten-4"
                    text-color="blue-grey-darken-3"
                    size="small"
                    class="text-capitalize"
                    rounded="lg"
                    style="width: 250px;"
                  >
                    {{ a.ability.name.replace('-', ' ') }}
                  </v-chip>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>
          
          <EvolutionChain 
            :evolution-stages="evolutionChain.data"
            :loading="evolutionChain.loading"
            :error="evolutionChain.error"
            :current-pokemon-id="Number(pokemon?.id)"
            @pokemon-click="handleEvolutionClick"
          />

        </v-card-text>
      </template>
    </v-card>
    <ConfirmRemoveDialog
      v-model:show="showConfirmDialog"
      :pokemon-name="pokemon?.name"
      @confirm="confirmRemove"
      @cancel="cancelRemove"
    />
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import EvolutionChain from './EvolutionChain.vue';
import ConfirmRemoveDialog from './ConfirmRemoveDialog.vue';
import { translateType } from '@/utils/pokemonUtils';

const props = defineProps({
  show: Boolean,
  pokemon: Object,
  evolutionChain: Object,
  loading: Boolean,
  error: String,
  canNavigatePrevious: Boolean,
  canNavigateNext: Boolean
});

const emit = defineEmits(['update:show', 'toggleDeck', 'showDetails', 'navigatePrevious', 'navigateNext']);
const showConfirmDialog = ref(false);

const handleToggleDeck = () => {
  if (props.pokemon.isAddedToDeck) {
    showConfirmDialog.value = true;
  } else {
    emit('toggleDeck', props.pokemon);
  }
};

const confirmRemove = () => {
  emit('toggleDeck', props.pokemon);
  showConfirmDialog.value = false;
};

const cancelRemove = () => {
  showConfirmDialog.value = false;
};

const handleEvolutionClick = (pokemonId) => {
  emit('showDetails', pokemonId);
};
</script>

<style scoped>
.navigation-btn {
  transition: none !important;
}

.navigation-btn:hover {
  background-color: transparent !important;
  box-shadow: none !important;
  transform: translateY(-50%) !important;
}

.navigation-btn:before {
  display: none !important;
}
</style>
