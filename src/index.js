import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Header from './components/Header/Header.component';
import HomePage from './pages/Home.page';
import ReactDOM from 'react-dom';

const App = () => {
  const [cookieTheme, setCookieTheme] = useCookies(['theme']);
  const [theme, setTheme] = useState(cookieTheme.value || 'dark');

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = newTheme;
    setCookieTheme('theme', newTheme, {
      sameSite: 'none',
      secure: true
    });
    setTheme(newTheme);
  };

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="app">
      <Header switchTheme={switchTheme} theme={theme} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;