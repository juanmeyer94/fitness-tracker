import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { WeightPage } from './pages/WeightPage';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { HabitsPage } from './pages/HabitsPage';
import { PhotosPage } from './pages/PhotosPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'weight':
        return <WeightPage />;
      case 'workouts':
        return <WorkoutsPage />;
      case 'habits':
        return <HabitsPage />;
      case 'photos':
        return <PhotosPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
