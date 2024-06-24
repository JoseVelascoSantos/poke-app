import axios from 'axios';
import {Pokemon} from "@/types/pokemon";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error)
    return undefined;
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error)
    return undefined;
  }
);

export const getPokemons = async (limit = 20, offset = 0) => {
  const response = await apiClient.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return response?.data;
};

export const getPokemonsByType = async (type: string) => {
  const response = await apiClient.get(`/type/${type}`);
  return response?.data;
};

export const getPokemonsByGeneration = async (generation: string) => {
  const response = await apiClient.get(`/generation/${generation}`);
  return response?.data;
};

export const getPokemonSpecies = async (name: string) => {
  const response = await apiClient.get(`/pokemon-species/${name}`);
  return response.data;
};

export const getEvolutionChain = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const extractEvolutionNames = (chain: any, evolutionSet: Set<string>) => {
  evolutionSet.add(chain.species.name);
  let evolvesTo = chain.evolves_to;
  while (evolvesTo.length) {
    evolutionSet.add(evolvesTo[0].species.name);
    evolvesTo = evolvesTo[0].evolves_to;
  }
};


let currentGetPokemonsBySearchId = 0;
export const getPokemonsBySearch = async (search: string) => {
  const getPokemonsBySearchId = ++currentGetPokemonsBySearchId;

  let data: Pokemon[] = [];
  let hasNext = true;
  const limit = 100;
  let offset = 0;
  const evolutionSet = new Set<string>();

  while (hasNext && getPokemonsBySearchId === currentGetPokemonsBySearchId) {
    const response = await apiClient.get(`/pokemon-species?limit=${limit}&offset=${offset}`);
    offset += limit;
    hasNext = response?.data?.next;

    const filteredPokemons = response?.data?.results.filter((pokemon: Pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    for (const pokemon of filteredPokemons) {
      if (getPokemonsBySearchId !== currentGetPokemonsBySearchId) break;
      const speciesData = await getPokemonSpecies(pokemon.name);
      const evolutionChainData = await getEvolutionChain(speciesData.evolution_chain.url);
      extractEvolutionNames(evolutionChainData.chain, evolutionSet);
    }
  }

  if (getPokemonsBySearchId == currentGetPokemonsBySearchId) return Array.from(evolutionSet).map(name => ({ name }));
  else return [];
};

export const getPokemonDetail = async (name: string) => {
  const response = await apiClient.get(`/pokemon/${name}`);
  return response?.data;
};

export default apiClient;
