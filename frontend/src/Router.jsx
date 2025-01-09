import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import NotFound from './components/NotFound/NotFound.jsx'
import Signs from './components/signs/Signs.jsx'

// Компоненты для разных страниц
const Home = () => <div>Главная страница</div>;
const About = () => <div>О нас</div>;
const Contact = () => <div>Контакты</div>;


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signs" element={<Signs />} />
        <Route path="/contact" element={<Contact />} />
        {/* Маршрут для несуществующих страниц */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;