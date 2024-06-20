import React, {useEffect, useState} from 'react';
import {Ability, Pokemon, Type} from '../../../types/pokemon';
import styles from './PokemonDetail.module.css';
import typeColors from "@/types/colors";
import gradients from "@/types/gradients";
import {extractEvolutionNames, getEvolutionChain, getPokemonSpecies} from "@/services/api";
import PokemonCard from "@/components/pokemon/pokemonCard/PokemonCard";

interface PokemonDetailProps {
  pokemon: Pokemon;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon }) => {
  const {
    id, name, height, weight, base_experience, abilities, sprites, types, stats
  } = pokemon;

  const [evolutions, setEvolutions] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const evolutionSet = new Set<string>();
      const speciesData = await getPokemonSpecies(name);
      const evolutionChainData = await getEvolutionChain(speciesData.evolution_chain.url);
      extractEvolutionNames(evolutionChainData.chain, evolutionSet);
      setEvolutions(Array.from(evolutionSet).map(name => ({ name })).filter((_pokemon) => _pokemon.name !== name));
    })();
  }, [name]);

  const primaryType = types.find(type => type.slot === 1)?.type.name || 'normal';
  const color = typeColors[primaryType];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  return (
    <div className={styles.container} style={{ background: gradients[primaryType] }}>
      <div className={styles.leftContainer}>
        <img src={imageUrl} alt={name} className={styles.pokemonImage} />
        <h1 className={styles.title}>{name}</h1>
      </div>
      <div className={styles.rightContainer}>
        <p className={styles.info}>Height: {height}</p>
        <p className={styles.info}>Weight: {weight}</p>
        <p className={styles.info}>Base experience: {base_experience}</p>
        <p className={styles.subTitle}>Abilities:</p>
        <ul className={styles.list}>
          {abilities.map((ability: Ability) => (
            <li key={ability.slot} className={styles.listItem}>
              {ability.ability.name}
            </li>
          ))}
        </ul>
        <p className={styles.subTitle}>Types:</p>
        <ul className={styles.list}>
          {types.map((type: Type) => (
            <li key={type.slot} className={styles.listItem}>
              {type.type.name}
            </li>
          ))}
        </ul>
        <h2 className={styles.subTitle}>Stats</h2>
        <ul className={styles.list}>
          {stats.map((statInfo) => (
            <li key={statInfo.stat.name} className={styles.listItem}>
              {statInfo.stat.name}: {statInfo.base_stat}
            </li>
          ))}
        </ul>
        <h2 className={styles.subTitle}>Evolutions:</h2>
        <div className={styles.evolutionContainer}>
          {evolutions.map((evolution: any) => (
            <PokemonCard key={evolution.name} name={evolution.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
