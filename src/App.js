import React from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import { HashRouter as Router } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Main />
      </Router>
    </div>
  );
}

export default App;
