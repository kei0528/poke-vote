import type { Pokemon } from '@/types/pokemon.type';
import Button from '../Button';

const VoteCard = ({
  pokemon,
  onVote,
}: {
  pokemon: Pokemon;
  onVote: (pokemon: Pokemon) => void;
}) => {
  return (
    <figure className="h-fit rounded-lg border-3 border-r-4 border-b-4 border-[#7BABC5] bg-[#FFFBFF] p-1 text-stone-950 outline-4 outline-stone-600">
      <div className="grid grid-cols-[35%_1fr] rounded bg-[#DFDADF] sm:grid-cols-[40%_1fr] md:grid-cols-[132px_1fr]">
        <div className="h-fit w-[100%] rounded-lg rounded-r-none md:w-fit">
          <img
            src={pokemon.img}
            alt={pokemon.name}
            className="animate-bounceSmall h-[132px] w-[132px] object-contain [image-rendering:pixelated] md:ml-0 md:h-[144px] md:w-[144px]"
          />
        </div>

        <div className="flex flex-col justify-center py-3 md:py-0">
          <figcaption className="h-fit rounded-r-lg px-4 text-xs sm:text-sm md:h-full md:py-3">
            <p className="uppercase sm:min-h-[60px]">{pokemon.name}</p>
            <div className="mt-2 flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0">
              <p>HT: {pokemon.height}m</p>
              <p>WT: {pokemon.weight}kg</p>
            </div>
            <p>EXP: {pokemon.baseExperience}</p>
          </figcaption>
          <Button className="mx-4 mt-3 w-32 text-xs sm:hidden" variant="submit">
            VOTE
          </Button>
        </div>
      </div>

      <Button
        onClick={() => void onVote(pokemon)}
        className="mx-auto my-3 hidden w-fit sm:block"
        variant="submit"
      >
        VOTE
      </Button>
    </figure>
  );
};

export default VoteCard;
