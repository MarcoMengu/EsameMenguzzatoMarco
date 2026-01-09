<template>
  <v-card 
    class="pokemon-card" 
    :style="cardStyle"
    @click="$emit('showDetails', pokemon.id)"
  >
    <div class="text-center pt-3" :style="{ color: textColor }">
      <div class="text-h8 font-weight-bold">#{{ pokemon.id }}</div>
    </div>
    
    <v-img 
      :src="pokemon.sprites.front_default" 
      height="100px" 
      contain
    ></v-img>

    <v-card-title class="text-center text-capitalize pt-1" :style="{ color: textColor }">
      {{ pokemon.name }}
    </v-card-title>

    <v-card-actions class="justify-center">
      <div class="d-flex ga-2">
        <v-chip
          v-for="(typeInfo, index) in pokemon.types"
          :key="index"
          color="white"
          size="small"
          rounded="lg"
        >
          {{ translateType(typeInfo.type.name) }}
        </v-chip>
      </div>
    </v-card-actions>
    
    <div class="d-flex justify-center pb-3">
      <v-btn 
        size="small"
        variant="flat"
        color="#313131"
        @click.stop="handleToggleDeck"
      >
        <span :style="{ color: pokemon.isAddedToDeck ? '#ef5350' : '#66bb6a' }">
          {{ pokemon.isAddedToDeck ? 'Rimuovi' : 'Aggiungi' }}
        </span>
      </v-btn>
    </div>
    <ConfirmRemoveDialog
      v-model:show="showConfirmDialog"
      :pokemon-name="pokemon.name"
      @confirm="confirmRemove"
      @cancel="cancelRemove"
    />
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import ConfirmRemoveDialog from './ConfirmRemoveDialog.vue';
import { getTypeColor, translateType } from '@/utils/pokemonUtils';

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggleDeck', 'showDetails']);
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

const primaryTypeColor = computed(() => getTypeColor(props.pokemon.types[0].type.name));
const secondaryTypeColor = computed(() => {
  return props.pokemon.types.length > 1 ? getTypeColor(props.pokemon.types[1].type.name) : primaryTypeColor.value;
});

const cardStyle = computed(() => ({
  background: props.pokemon.types.length > 1
    ? `linear-gradient(135deg, ${primaryTypeColor.value} 0%, ${secondaryTypeColor.value} 100%)`
    : primaryTypeColor.value,
}));

const textColor = computed(() => '#FFFFFF');

</script>

<style scoped>
.pokemon-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  position: relative;
}
.pokemon-card:hover {
  transform: scale(1.05);
}

</style>