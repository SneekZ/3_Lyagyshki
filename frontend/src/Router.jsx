import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import NotFound from './components/NotFound/NotFound.jsx'
import Signs from './components/signs/Signs.jsx'
import Notification from './components/Utils/Notification.jsx';

// Компоненты для разных страниц
const Home = () => <div>Главная страница</div>;


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signs" replace />} />
        <Route path="/signs" element={<Signs />} />
        <Route path="/notification" element={<Notification description="Ошибка хуибка"/>} />
        {/* Маршрут для несуществующих страниц */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;