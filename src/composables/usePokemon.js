import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getMyPokemonIds, addPokemonToDeck, removePokemonFromDeck } from '@/services/firebaseService.js';
import { parseEvolutionChain } from '@/utils/pokemonUtils.js';
import axios from 'axios';

export function usePokemon() {
  const router = useRouter();
  const route = useRoute();

  const allPokemon = ref([]);
  const myPokemonIds = ref(new Set());
  const types = ref([]);
  const isLoading = ref(true);
  const error = ref(null);

  const searchTerm = ref('');
  const selectedType = ref(null);
  const showOnlyMyPokemon = ref(false);
  const currentPage = ref(parseInt(route.params.page) || 1);
  const itemsPerPage = 18;

  const selectedPokemonDetails = reactive({
    data: null,
    loading: false,
    error: null,
  });
  const selectedPokemonEvolutionChain = reactive({
    data: [],
    loading: false,
    error: null,
  });

  const snackbar = reactive({
    show: false,
    message: '',
    pokemonName: '',
    color: '',
  });

  const ignoreRouteUpdate = ref(false);
  const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

  const fetchAllPokemon = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=1025`); 
      const results = response.data.results;
      
      const pokemonPromises = results.map(p => axios.get(p.url));
      const pokemonResponses = await Promise.all(pokemonPromises);
      
      allPokemon.value = pokemonResponses.map(res => res.data);
    } catch (e) {
      error.value = 'Impossibile caricare la lista dei Pokémon.';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };
  
  const fetchTypes = async () => {
      try {
          const response = await axios.get(`${POKEAPI_BASE_URL}/type`);
          types.value = response.data.results;
      } catch (e) {
          console.error("Impossibile caricare i tipi di Pokémon", e);
      }
  };

  const fetchMyPokemon = async () => {
    myPokemonIds.value = await getMyPokemonIds();
  };

  const fetchPokemonDetails = async (pokemonId) => {
    selectedPokemonDetails.loading = true;
    selectedPokemonDetails.error = null;
    try {
      const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${pokemonId}`);
      selectedPokemonDetails.data = response.data; 
      await fetchEvolutionChain(response.data.species.url);
    } catch (e) {
      selectedPokemonDetails.error = `Dettaglio errore: ${e.message}`;
      console.error(e);
    } finally {
      selectedPokemonDetails.loading = false;
    }
  };

  const fetchEvolutionChain = async (speciesUrl) => {
    selectedPokemonEvolutionChain.loading = true;
    selectedPokemonEvolutionChain.error = null;
    try {
      const speciesResponse = await axios.get(speciesUrl);
      const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
      
      const chainResponse = await axios.get(evolutionChainUrl);
      selectedPokemonEvolutionChain.data = parseEvolutionChain(chainResponse.data.chain);
  
    } catch (e) {
      selectedPokemonEvolutionChain.error = 'Impossibile caricare la catena evolutiva.';
      console.error(e);
    } finally {
      selectedPokemonEvolutionChain.loading = false;
    }
  };
  
  const pokemonWithDeckStatus = computed(() => {
    return allPokemon.value.map(p => ({
      ...p,
      isAddedToDeck: myPokemonIds.value.has(p.id)
    }));
  });

  const filteredPokemon = computed(() => {
    return pokemonWithDeckStatus.value.filter(p => {
      if (searchTerm.value.startsWith('#')) {
        const searchId = parseInt(searchTerm.value.substring(1));
        return !isNaN(searchId) && p.id === searchId;
      }
      
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.value.toLowerCase());
      const matchesType = selectedType.value ? p.types.some(t => t.type.name.toLowerCase() === selectedType.value.toLowerCase()) : true;
      return matchesSearch && matchesType;
    });
  });

  const myFilteredPokemon = computed(() => {
    return filteredPokemon.value.filter(p => p.isAddedToDeck);
  });
  
  const pokemonToDisplay = computed(() => {
      return showOnlyMyPokemon.value ? myFilteredPokemon.value : filteredPokemon.value;
  });

  const paginatedPokemon = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return pokemonToDisplay.value.slice(start, end);
  });

  const totalPages = computed(() => {
      return Math.ceil(pokemonToDisplay.value.length / itemsPerPage);
  });

  const togglePokemonInDeck = async (pokemon) => {
    const capitalizedName = `<strong>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</strong>`;

    if (pokemon.isAddedToDeck) {
      await removePokemonFromDeck(pokemon.id);
      myPokemonIds.value.delete(pokemon.id);
      snackbar.message = `${capitalizedName} è stato rimosso dal tuo deck!`;
      snackbar.color = '#191B1C';
    } else {
      await addPokemonToDeck(pokemon);
      myPokemonIds.value.add(pokemon.id);
      snackbar.message = `${capitalizedName} è stato aggiunto al tuo deck!`;
      snackbar.color = '#191B1C';
    }
    snackbar.show = true;
    myPokemonIds.value = new Set(myPokemonIds.value);
  };
  
  const updateQuery = (partialQuery) => {
    if (ignoreRouteUpdate.value) return;

    const searchVal = 'search' in partialQuery ? partialQuery.search : route.query.search;
    const typeVal = 'type' in partialQuery ? partialQuery.type : route.query.type;

    const newQuery = {};
    if (searchVal && searchVal !== '') newQuery.search = searchVal;
    if (typeVal) newQuery.type = typeVal;

    router.push({ name: route.name, params: { page: 1 }, query: newQuery });
    currentPage.value = 1;
  };

  watch(() => route.query, (newQuery) => {
    ignoreRouteUpdate.value = true;
    searchTerm.value = newQuery.search || '';
    selectedType.value = newQuery.type || null;
    ignoreRouteUpdate.value = false;
  }, { deep: true, immediate: true });

  watch(searchTerm, (newVal) => {
    updateQuery({ search: newVal });
  });

  watch(selectedType, (newVal) => {
    updateQuery({ type: newVal });
  });

  const toggleShowOnlyMyPokemon = () => {
    showOnlyMyPokemon.value = !showOnlyMyPokemon.value;
    const newName = showOnlyMyPokemon.value ? 'my-pokemon-page' : 'all-pokemon-page';
    router.push({ name: newName, params: { page: 1 }, query: route.query });
  };

  const changePage = (newPage) => {
    currentPage.value = newPage;
    router.push({ name: route.name, params: { page: newPage }, query: route.query });
  };

  watch(() => route.params.page, (newPage) => {
    if (newPage) {
      currentPage.value = parseInt(newPage);
    }
  });

  watch(() => route.path, (newPath) => {
    showOnlyMyPokemon.value = newPath.startsWith('/mypokemon');
  }, { immediate: true });

  const navigateToPreviousPokemon = async () => {
    if (!selectedPokemonDetails.data) return;
    
    const currentId = selectedPokemonDetails.data.id;
    const pokemonList = pokemonToDisplay.value;
    const currentIndex = pokemonList.findIndex(p => p.id === currentId);
    
    if (currentIndex > 0) {
      const previousPokemon = pokemonList[currentIndex - 1];
      await fetchPokemonDetails(previousPokemon.id);
    }
  };

  const navigateToNextPokemon = async () => {
    if (!selectedPokemonDetails.data) return;
    
    const currentId = selectedPokemonDetails.data.id;
    const pokemonList = pokemonToDisplay.value;
    const currentIndex = pokemonList.findIndex(p => p.id === currentId);
    
    if (currentIndex < pokemonList.length - 1) {
      const nextPokemon = pokemonList[currentIndex + 1];
      await fetchPokemonDetails(nextPokemon.id);
    }
  };

  const canNavigatePrevious = computed(() => {
    if (!selectedPokemonDetails.data) return false;
    if (showOnlyMyPokemon.value && !myPokemonIds.value.has(selectedPokemonDetails.data.id)) {
      return false;
    }
    
    const currentId = selectedPokemonDetails.data.id;
    const pokemonList = pokemonToDisplay.value;
    const currentIndex = pokemonList.findIndex(p => p.id === currentId);
    return currentIndex > 0;
  });

  const canNavigateNext = computed(() => {
    if (!selectedPokemonDetails.data) return false;
    if (showOnlyMyPokemon.value && !myPokemonIds.value.has(selectedPokemonDetails.data.id)) {
      return false;
    }
    
    const currentId = selectedPokemonDetails.data.id;
    const pokemonList = pokemonToDisplay.value;
    const currentIndex = pokemonList.findIndex(p => p.id === currentId);
    return currentIndex < pokemonList.length - 1;
  });

  onMounted(async () => {
    await fetchAllPokemon();
    await fetchTypes();
    await fetchMyPokemon();
  });

  return {
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
    myFilteredPokemonCount: computed(() => myFilteredPokemon.value.length),
    totalFilteredPokemon: computed(() => filteredPokemon.value.length),
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
  };
}