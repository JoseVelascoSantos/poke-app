import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {getPokemons, getPokemonsByGeneration, getPokemonsBySearch, getPokemonsByType} from '../../../services/api';
import {useRouter} from "next/router";
import {debounce} from "next/dist/server/utils";
import PokemonCard from "@/components/pokemon/pokemonCard/PokemonCard";

import styles from './PokemonList.module.css';

const PokemonList = () => {
  const router = useRouter();
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const page = useMemo(() => (
    parseInt((router.query.page as string) || '0', 10)
  ), [router.query.page]);
  const type = useMemo(() => (
    (router.query.type as string) || ''
  ), [router.query.type]);
  const generation = useMemo(() => (
    (router.query.generation as string) || ''
  ), [router.query.generation]);
  const search = useMemo(() => (
    (router.query.search as string) || ''
  ), [router.query.search]);
  const paginationDisabled = useMemo(() => (type || generation || search), [type, generation, search]);
  const [totalCount, setTotalCount] = useState(0);
  const limit = useMemo(() => 50, []);
  const totalPages = useMemo(() => (Math.ceil(totalCount / limit)), [limit, totalCount]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (search) {
          const data = await getPokemonsBySearch(search);
          setPokemons(data);
          setTotalCount(data.length);
        } else if (generation) {
          const data = await getPokemonsByGeneration(generation);
          setPokemons(data.pokemon_species);
          setTotalCount(data.pokemon_species.length);
        } else if (type) {
          const data = await getPokemonsByType(type);
          setPokemons(data.pokemon.map((data: any) => data.pokemon));
          setTotalCount(data.pokemon.length);
        } else {
          const data = await getPokemons(limit, page * limit);
          setPokemons(data.results);
          setTotalCount(data.count);
        }
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [generation, limit, page, search, type]);

  const handlePageChange = useCallback((newPage: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    });
  }, [router]);

  const handleTypeChange = useCallback((newType: string) => {
    const currentQuery = { ...router.query };
    if (newType === "") {
      delete currentQuery.type;
    } else {
      currentQuery.type = newType;
    }

    router.push({
      pathname: router.pathname,
      query: currentQuery,
    });
  }, [router]);

  const handleGenerationChange = useCallback((newGeneration: string) => {
    const currentQuery = { ...router.query };
    if (newGeneration === "") {
      delete currentQuery.generation;
    } else {
      currentQuery.generation = newGeneration;
    }

    router.push({
      pathname: router.pathname,
      query: currentQuery,
    });
  }, [router]);

  const handleSearchChange = useCallback(debounce((newSearch: string) => {
    const currentQuery = { ...router.query };
    if (newSearch === '') {
      delete currentQuery.search;
    } else {
      delete currentQuery.type;
      delete currentQuery.generation;
      currentQuery.search = newSearch;
    }

    router.push({
      pathname: router.pathname,
      query: currentQuery,
    });
  }, 1000), [router]);

  return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        <input defaultValue={search} onChange={(e) => handleSearchChange(e.target.value)} />
        <select disabled={search !== '' || generation !== ''} onChange={(e) => handleTypeChange(e.target.value)} value={type}>
          <option value="">All Types</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
        </select>
        <select disabled={search !== '' || type !== ''} onChange={(e) => handleGenerationChange(e.target.value)} value={generation}>
          <option value="">All generations</option>
          <option value="generation-i">I</option>
          <option value="generation-ii">II</option>
          <option value="generation-iii">III</option>
          <option value="generation-iv">IV</option>
          <option value="generation-v">V</option>
          <option value="generation-vi">VI</option>
          <option value="generation-vii">VII</option>
          <option value="generation-viii">VIII</option>
          <option value="generation-ix">IX</option>
        </select>
      </div>

      {loading && <div>Loading...</div>}
      {error && (<div>Error: {error.message}</div>)}
      <div style={{ flex: 1, overflow: 'scroll' }}>
      {!loading && !error && (
        <div className={styles.pokemonsContainer}>
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.name} name={pokemon.name} />
          ))}
        </div>
      )}
      </div>
      {!paginationDisabled && (
        <div className={styles.paginationContainer}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className={styles.pageButton}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
          Page {page + 1} of {totalPages}
        </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PokemonList;
