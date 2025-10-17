import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* 404 页面 - 捕获所有未匹配的路由 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
