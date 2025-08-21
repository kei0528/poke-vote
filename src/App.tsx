import VoteProvider from './components/providers/VoteProvider';
import Router from './routes';

const App = () => {
  return (
    <VoteProvider>
      <Router />
    </VoteProvider>
  );
};

export default App;
