<template>
  <v-app theme="dark">
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<style>
html, body, #app, .v-application { 
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif !important; 
}
.v-main {
  background-color: rgb(var(--v-theme-background)); 
}

.v-card-title, .v-card-subtitle, .v-card-text, .text-h4, .text-h5, p, .v-btn, .v-chip {
  font-family: 'Inter', sans-serif !important;
}
</style>