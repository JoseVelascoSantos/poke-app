import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getPokemonDetail } from '../../services/api';
import styles from '../../styles/Home.module.css';
import PokemonDetail from "@/components/pokemon/pokemonDetail/PokemonDetail";

import {Pokemon} from "@/types/pokemon";


const PokemonDetailPage = ({ pokemon }: {pokemon: Pokemon}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{pokemon.name} Details</title>
        <meta name="description" content={`Details of ${pokemon.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <PokemonDetail pokemon={pokemon} />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params;
  const pokemon = await getPokemonDetail(id);

  return {
    props: {
      pokemon,
    },
  };
};

export default PokemonDetailPage;
