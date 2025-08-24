import { useVote } from '@/components/providers/VoteProvider';
import LayoutGBA from '@/components/ui/Layout';
import MessageBox from '@/components/ui/MessageBox';
import { PokemonService } from '@/services/pokemonService';
import type { Pokemon } from '@/types/pokemon.type';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const VoteResult = () => {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const { results } = useVote();
  const [pokemons, setPokemons] = useState<[Pokemon, Pokemon] | null>(null);
  const result = results?.find((r) => r.roundId === roundId);

  useEffect(() => {
    if (result) {
      Promise.all(
        Object.keys(result.tally).map((pokemonId) => PokemonService.fetchPokemon(Number(pokemonId)))
      ).then((res) => {
        setPokemons(res as [Pokemon, Pokemon]);
      });
    }
  }, []);

  if (!result) {
    navigate('/');
    return null;
  }

  const percentages: Record<Pokemon['id'], number> = {};
  Object.keys(result.tally).forEach((id) => {
    percentages[Number(id)] = Math.round(
      (result.tally[Number(id)] / Object.values(result.tally).reduce((a, b) => a + b, 0)) * 100
    );
  });

  return (
    <LayoutGBA>
      <div className="grid gap-4 sm:grid-cols-2">
        {pokemons?.map((pokemon) => (
          <figure className="h-fit rounded-lg border-3 border-r-4 border-b-4 border-[#7BABC5] bg-[#FFFBFF] p-1 text-stone-950 outline-4 outline-stone-600">
            <div className="rounded bg-[#DFDADF]">
              <img className="mx-auto h-24 w-24 sm:h-32 sm:w-32" alt="" src={pokemon.img} />

              <figcaption className="flex flex-col items-center">
                <p className="text-center text-yellow-600">#1 Trainer's Choice</p>
                <div className="flex sm:flex-col sm:items-center">
                  <p className="uppercase">{pokemon.name}</p>{' '}
                  <span className="mx-2 inline-block sm:hidden">-</span>{' '}
                  <p>
                    {result?.tally[pokemon.id]} votes ({percentages[pokemon.id]}%)
                  </p>
                </div>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
      <MessageBox
        className="mt-auto"
        text="Thanks for your vote! Let's see other trainers' favorites..."
      />
    </LayoutGBA>
  );
};

export default VoteResult;
