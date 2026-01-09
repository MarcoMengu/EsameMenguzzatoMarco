import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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