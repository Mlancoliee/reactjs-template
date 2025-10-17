import React from 'react';
import logo from '../logo.svg';
import '../App.css';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>欢迎来到首页</h1>
        <p>
          这是一个使用 React Router 的示例项目
        </p>
        <div style={{ marginTop: '20px' }}>
          <a
            className="App-link"
            href="/about"
            style={{ marginRight: '20px' }}
          >
            关于我们
          </a>
          <a
            className="App-link"
            href="/non-existent-page"
          >
            测试 404 页面
          </a>
        </div>
      </header>
    </div>
  );
}

export default Home;

