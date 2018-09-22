import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import SMApp from './js/container/smapp';

const app = (props) => {
  return (
    <BrowserRouter>
      <SMApp />
    </BrowserRouter>
  )
}

export default app;
