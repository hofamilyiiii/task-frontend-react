import { Routes, Route, Navigate } from 'react-router-dom';
import { BaseLayout } from './components/layout/BaseLayout';
import { RoomsPage } from './pages/rooms';
import { RoomPage } from './pages/room';

function App() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Navigate to="/rooms" replace />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/room/:id" element={<RoomPage />} />
      </Route>
    </Routes>
  );
}

export default App;
