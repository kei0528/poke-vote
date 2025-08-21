import type { Pokemon } from '@/types/pokemon.type';
import { createContext, useContext, useState } from 'react';

const VoteContext = createContext<{
  pokemonVoted: null | Pokemon;
  setPokemonVoted: (pokemon: Pokemon) => void;
}>({
  pokemonVoted: null,
  setPokemonVoted: () => {},
});

const VoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [pokemonVoted, setPokemonVoted] = useState<Pokemon | null>(null);

  return (
    <VoteContext.Provider
      value={{
        pokemonVoted,
        setPokemonVoted: (pokemon) => void setPokemonVoted(pokemon),
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};

export const useVoteContext = () => {
  const { pokemonVoted, setPokemonVoted } = useContext(VoteContext);

  return { pokemonVoted, setPokemonVoted };
};

export default VoteProvider;
