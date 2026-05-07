import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { AppRouter } from './routes/AppRouter';
import { ScrollToTop } from './routes/ScrollToTop';
import { useAuthStore } from './store/authStore';

function App() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  useEffect(() => {
    const unsubscribe = initAuthListener();

    return unsubscribe;
  }, [initAuthListener]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;

