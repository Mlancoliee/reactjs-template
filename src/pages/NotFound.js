import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function NotFound() {
  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '8rem', margin: '0', color: '#61dafb' }}>404</h1>
          <h2 style={{ fontSize: '2rem', margin: '20px 0' }}>页面未找到</h2>
          <p style={{ fontSize: '1.2rem', color: '#999', marginBottom: '40px' }}>
            抱歉，您访问的页面不存在。
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link 
              to="/" 
              className="App-link"
              style={{
                padding: '12px 24px',
                backgroundColor: '#61dafb',
                color: '#282c34',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              返回首页
            </Link>
            <button 
              onClick={() => window.history.back()}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#61dafb',
                border: '2px solid #61dafb',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s'
              }}
            >
              返回上一页
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default NotFound;

