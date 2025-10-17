import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function About() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>关于我们</h1>
        <p>
          这是关于页面，展示如何使用 React Router 进行页面导航。
        </p>
        <Link to="/" className="App-link" style={{ marginTop: '20px' }}>
          返回首页
        </Link>
      </header>
    </div>
  );
}

export default About;

