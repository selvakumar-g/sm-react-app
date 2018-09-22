import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css'
import './css/app.css';


ReactDOM.render(<App />, document.getElementById('react-root'));
registerServiceWorker();
