import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage onNavigateToDashboard={() => setCurrentView('dashboard')} />
      ) : (
        <Dashboard onNavigateToLanding={() => setCurrentView('landing')} />
      )}
    </>
  );
}

export default App;
