import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import styles from './PokemonCard.module.css';
import typeColors from '../../../types/colors';
import {Pokemon, Type} from "@/types/pokemon";
import {getPokemonDetail} from "@/services/api";
import gradients from "@/types/gradients";
import axios from "axios";

interface PokemonCardProps {
  name: string
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name }) => {

  const [pokemon, setPokemon] = useState<Pokemon>();
  const [generation, setGeneration] = useState('');

  useEffect(() => {
    (async() => {
      setPokemon(await getPokemonDetail(name));
    })();
  }, [name]);

  useEffect(() => {
    if (pokemon) {
      (async () => {
        const specie = await axios.get(pokemon.species.url);
        if (specie?.data?.generation.name) setGeneration(specie?.data?.generation.name)
      })();
    }
  }, [pokemon]);

  if (!pokemon) return <div>Loading...</div>;

  const { id, types } = pokemon;

  const primaryType = types.find(type => type.slot === 1)?.type.name || 'normal';
  const color = typeColors[primaryType];

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <Link href={`/pokemon/${name}`} className={styles.card} style={{ background: gradients[primaryType] }}>
      <img src={imageUrl} alt={name} className={styles.image} />
      <div className={styles.details}>
        <h3 className={styles.name} style={{ color: color }}>{name}</h3>
        <h5 className={styles.generation} style={{ color: color }}>{generation}</h5>
        <div className={styles.typeContainer}>
          {types.map((type: Type) => (
            <span key={type.slot} className={styles.type} style={{ backgroundColor: typeColors[type.type.name] }}>{type.type.name}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;
