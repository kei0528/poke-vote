import { useLiveConnection } from '@/components/providers/LiveConnectionProvider';
import { useVote } from '@/components/providers/VoteProvider';
import LayoutGBA from '@/components/ui/Layout';
import MessageBox from '@/components/ui/MessageBox';
import StepActionYesNo from '@/components/ui/StepAction';
import VoteCard from '@/components/ui/VoteCard';
import type { LiveConnectionMessage } from '@/types/liveConnection.type';
import type { Pokemon } from '@/types/pokemon.type';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const Vote = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: { roundId: string; pair: [Pokemon, Pokemon] };
  };
  const { onVote } = useVote();
  const { role, hostSendMessage, guestSendMessage } = useLiveConnection();
  const [pokemonSelected, setPokemonSelected] = useState<Pokemon | null>(null);

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  });

  if (!state) return null;

  return (
    <LayoutGBA className="[&_[data-id='gba-inner']]:content-start [&_[data-id='gba-inner']]:gap-5 [&_[data-id='gba-inner']]:bg-[repeating-linear-gradient(0deg,#fffbff,#fffbff_10px,#F7EBC5_10px,#F7EBC5_20px)]">
      <div className="flex h-fit items-center gap-5 rounded-lg border-x-8 border-y-4 border-[#716789] bg-[#FFFBFF] [background-clip:padding-box] p-4 outline-4 outline-stone-600">
        <img className="h-8 w-8 sm:h-12 sm:w-12" alt="Pokeball" src="/webp/pokeball.webp" />
        <h1 className="sm:text-xl md:sm:text-2xl">Vote for your favorite Pokémon!</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:gap-5">
        {state?.pair.map((pokemon) => (
          <VoteCard pokemon={pokemon} onVote={(pokemon) => setPokemonSelected(pokemon)} />
        ))}
      </div>

      {pokemonSelected && (
        <div className="absolute top-0 left-0 grid h-full w-full bg-stone-950/90">
          <StepActionYesNo
            className="mt-16 mr-4 ml-auto"
            action={{
              yes: () => {
                const action: LiveConnectionMessage = {
                  type: 'vote',
                  payload: {
                    roundId: state.roundId,
                    choiceId: pokemonSelected.id,
                  },
                };

                onVote({ roundId: state.roundId, choiceId: pokemonSelected.id });

                if (role === 'host') hostSendMessage(action);
                if (role === 'guest') guestSendMessage(action);

                navigate('/vote/result/' + state.roundId);
              },
              no: () => void setPokemonSelected(null),
            }}
          />
          <MessageBox
            className="mx-4 mt-auto mb-7 h-fit"
            text={`${pokemonSelected.name.toUpperCase()} is your favorite Pokémon, is that correct?`}
          />
        </div>
      )}
    </LayoutGBA>
  );
};

export default Vote;
