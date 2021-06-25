import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import AppRoutes from './router/AppRoutes';
import store from './store';

const App: React.FC = (): JSX.Element => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;
