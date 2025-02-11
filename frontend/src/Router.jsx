import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import NotFound from './components/NotFound/NotFound.jsx'
import Signs from './components/signs/Signs.jsx'
import CopyTextField from './components/Utils/CopyField.jsx'

// Компоненты для разных страниц
const Home = () => <div>Главная страница</div>;


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signs" replace />} />
        <Route path="/signs" element={<Signs />} />
        <Route path="/test" element={<CopyTextField inputText="hello" />} />
        {/* Маршрут для несуществующих страниц */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;