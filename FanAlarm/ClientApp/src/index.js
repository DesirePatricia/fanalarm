import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { StateProvider } from "./utils/StateProvider";
import reducer, { initialState } from "./utils/Reducer";

const rootElement = document.getElementById('root');

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
    <StateProvider initialState={initialState} reducer={reducer}>
        <App />
    </StateProvider>
    </BrowserRouter >
    </React.StrictMode >,
  rootElement);

