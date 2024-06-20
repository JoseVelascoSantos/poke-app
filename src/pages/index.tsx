import dynamic from 'next/dynamic';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const PokemonList = dynamic(() => import('../components/pokemon/pokemonList/PokemonList'), { ssr: false });

const PokemonPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pokémon List</title>
        <meta name="description" content="List of Pokémon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Pokémon List
        </h1>

        <PokemonList />
      </main>
    </div>
  );
};

export default PokemonPage;
