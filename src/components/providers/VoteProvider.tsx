import type { Pokemon } from '@/types/pokemon.type';
import { createContext, useContext, useState } from 'react';

type VoteResult = { roundId: string; tally: Record<Pokemon['id'], number> };
const VoteContext = createContext<{
  results: null | VoteResult[];
  setResults: React.Dispatch<React.SetStateAction<VoteResult[]>>;
}>({
  results: null,
  setResults: () => [],
});

const VoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [results, setResults] = useState<VoteResult[]>([]);

  return (
    <VoteContext.Provider
      value={{
        results,
        setResults,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};

export const useVote = () => {
  const { results, setResults } = useContext(VoteContext);

  function onNewRound({
    roundId,
    pair,
  }: {
    roundId: string;
    pair: [Pokemon['id'], Pokemon['id']];
  }) {
    setResults((state) => [...(state ?? []), { roundId, tally: { [pair[0]]: 0, [pair[1]]: 0 } }]);
  }

  function onVote({ roundId, choiceId }: { roundId: string; choiceId: Pokemon['id'] }) {
    setResults((state) =>
      state.map((s) =>
        s.roundId === roundId
          ? {
              ...s,
              tally: {
                ...s.tally,
                [choiceId]: s.tally[choiceId] + 1,
              },
            }
          : s
      )
    );
  }

  return { results, onVote, onNewRound };
};

export default VoteProvider;
