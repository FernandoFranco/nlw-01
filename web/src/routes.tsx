import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import Createpoint from './pages/CreatePoint';

const Routes = () => (
  <BrowserRouter>
    <Route component={Home} path="/" exact />
    <Route component={Createpoint} path="/create-point" />
  </BrowserRouter>
);

export default Routes;
