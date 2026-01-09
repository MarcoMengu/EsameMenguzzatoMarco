import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyB-GD6bN23ZZ_0lhQHde-Mi2Ilx44yOkt4",
  authDomain: "informatica2-9bdb7.firebaseapp.com",
  projectId: "informatica2-9bdb7",
  storageBucket: "informatica2-9bdb7.firebasestorage.app",
  messagingSenderId: "35262820507",
  appId: "1:35262820507:web:9931df98fb08df6a26d63e"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const myPokemonCollection = collection(db, 'my_pokemon');

export const getMyPokemonIds = async () => {
  try {
    const snapshot = await getDocs(myPokemonCollection);
    const ids = new Set();
    snapshot.forEach(doc => {
      ids.add(parseInt(doc.id, 10));
    });
    return ids;
  } catch (error) {
    console.error("Errore nel recuperare i Pokémon da Firestore:", error);
    return new Set();
  }
};


export const addPokemonToDeck = async (pokemon) => {
  try {
    const pokemonDocRef = doc(db, 'my_pokemon', String(pokemon.id));
    await setDoc(pokemonDocRef, { name: pokemon.name });
  } catch (error) {
    console.error(`Errore nell'aggiungere il Pokémon ${pokemon.id}:`, error);
    throw error;
  }
};


export const removePokemonFromDeck = async (pokemonId) => {
  try {
    const pokemonDocRef = doc(db, 'my_pokemon', String(pokemonId));
    await deleteDoc(pokemonDocRef);
  } catch (error) {
    console.error(`Errore nel rimuovere il Pokémon ${pokemonId}:`, error);
    throw error;
  }
};