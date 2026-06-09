import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Homepage from './pages/Homepage';
import CreatePage from './pages/createpage';
import NoteDetailsPage from './pages/NoteDetailsPage';


const App = () => {
  return (
    <div data-theme="halloween" className="min-h-screen bg-base-100 text-base-content">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/notes/:id" element={<NoteDetailsPage />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default App
