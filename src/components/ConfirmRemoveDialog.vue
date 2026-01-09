<template>
  <v-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" max-width="400px">
    <v-card>
      <v-card-title class="text-h6 text-center pa-4" :style="{ color: '#ef5350' }">
        Conferma Rimozione
      </v-card-title>
      
      <v-card-text class="text-center pb-2">
        <p class="text-body-1 mb-4">
          Sei sicuro di voler rimuovere <strong class="text-capitalize">{{ pokemonName }}</strong>?
        </p>
      </v-card-text>
      
      <v-card-actions class="justify-center pa-4 pt-0">
        <v-btn
          color="red-lighten-2"
          variant="outlined"
          @click="$emit('confirm')"
          :style="{ color: '#ef5350' }"
          class="mr-2"
        >
          Sì
        </v-btn>
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          @click="$emit('cancel')"
        >
          No
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  show: Boolean,
  pokemonName: String
});

defineEmits(['update:show', 'confirm', 'cancel']);
</script>