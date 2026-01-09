const typeColors = {
  normal: '#A8A77A80',
  fire: '#EE813080',
  water: '#6390F080',
  electric: '#F7D02C80',
  grass: '#7AC74C80',
  ice: '#96D9D680',
  fighting: '#C22E2880',
  poison: '#A33EA180',
  ground: '#E2BF6580',
  flying: '#A98FF380',
  psychic: '#F9558780',
  bug: '#A6B91A80',
  rock: '#B6A13680',
  ghost: '#73579780',
  dragon: '#6F35FC80',
  dark: '#70574680',
  steel: '#B7B7CE80',
  fairy: '#D685AD80',
};

const typeTranslations = {
  normal: 'Normale',
  fire: 'Fuoco',
  water: 'Acqua',
  electric: 'Elettro',
  grass: 'Erba',
  ice: 'Ghiaccio',
  fighting: 'Lotta',
  poison: 'Veleno',
  ground: 'Terra',
  flying: 'Volante',
  psychic: 'Psico',
  bug: 'Coleottero',
  rock: 'Roccia',
  ghost: 'Spettro',
  dragon: 'Drago',
  dark: 'Buio',
  steel: 'Acciaio',
  fairy: 'Fata',
};


export const translateType = (typeName) => {
  return typeTranslations[typeName.toLowerCase()] || typeName;
};


export const getTypeColor = (typeName) => {
  return typeColors[typeName.toLowerCase()] || '#FFFFFF'; 
};


export const parseEvolutionChain = (chainData) => {
    if (!chainData) return [];
    const evolutionStages = [];
    let currentStage = chainData;
    while (currentStage) {
        const stageGroup = [];
        const speciesName = currentStage.species.name;
        const speciesId = currentStage.species.url.split('/').filter(Boolean).pop();
        stageGroup.push({ name: speciesName, id: speciesId });
        if (currentStage.evolves_to && currentStage.evolves_to.length > 1) {
            currentStage.evolves_to.forEach(evolution => {
                const parallelSpeciesName = evolution.species.name;
                const parallelSpeciesId = evolution.species.url.split('/').filter(Boolean).pop();
                stageGroup.push({ name: parallelSpeciesName, id: parallelSpeciesId });
            });
            evolutionStages.push(stageGroup);
            currentStage = null;
        } else {
            evolutionStages.push(stageGroup);
            currentStage = currentStage.evolves_to ? currentStage.evolves_to[0] : null;
        }
    }
    return evolutionStages;
};