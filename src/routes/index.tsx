import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Home } from './Home';
import Vote from './Vote';
import { PokemonService } from '@/services/pokemonService';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
