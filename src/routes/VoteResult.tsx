import LayoutGBA from '@/components/ui/Layout';
import MessageBox from '@/components/ui/MessageBox';

const VoteResult = () => {
  return (
    <LayoutGBA>
      <div className="grid sm:grid-cols-[45%_1fr] md:grid-cols-[40%_1fr]">
        <figure className="h-fit rounded-lg border-3 border-r-4 border-b-4 border-[#7BABC5] bg-[#FFFBFF] p-1 text-stone-950 outline-4 outline-stone-600">
          <div className="rounded bg-[#DFDADF]">
            <img
              className="mx-auto h-24 w-24 sm:h-32 sm:w-32"
              alt=""
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/34.png"
            />

            <figcaption className="flex flex-col items-center">
              <p className="text-center text-yellow-600">#1 Trainer's Choice</p>
              <div className="flex sm:flex-col sm:items-center">
                <p>Nidoking</p> <span className="mx-2 inline-block sm:hidden">-</span>{' '}
                <p>100 votes (80%)</p>
              </div>
            </figcaption>
          </div>
        </figure>
      </div>
      <MessageBox
        className="mt-auto"
        text="Thanks for your vote! Let's see other trainers' favorites..."
      />
    </LayoutGBA>
  );
};

export default VoteResult;
