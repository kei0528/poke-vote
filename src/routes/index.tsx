import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Home } from './Home';
import Vote from './Vote';
import VoteResult from './VoteResult';
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
    children: [
      {
        index: true,
        element: <Vote />,
      },
      {
        path: 'result',
        children: [
          { index: false },
          {
            path: ':roundId',
            element: <VoteResult />,
          },
        ],
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
