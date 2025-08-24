import LiveConnectionProvider from './components/providers/LiveConnectionProvider';
import VoteProvider from './components/providers/VoteProvider';
import Router from './routes';
import { Toaster } from '@/components/ui/Sonner/Sonner';

const App = () => {
  return (
    <VoteProvider>
      <LiveConnectionProvider>
        <Router />
        <Toaster />
      </LiveConnectionProvider>
    </VoteProvider>
  );
};

export default App;
