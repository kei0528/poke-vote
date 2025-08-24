import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Home } from './Home';
import Vote from './Vote';
import { PokemonService } from '@/services/pokemonService';
import VoteResult from './VoteResult';
import Playground from './Playground';
import WaitingRoom from './WaitingRoom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/waiting-room',
    element: <WaitingRoom />,
  },
  {
    path: '/vote',
    loader: async () => {
      return {
        pokemonsToVote: await PokemonService.getTwoRandom(),
      };
    },
    element: <Vote />,
  },
  {
    path: '/vote/result',
    element: <VoteResult />,
  },
  {
    path: '/playground',
    element: <Playground />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
