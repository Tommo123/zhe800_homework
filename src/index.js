import React from 'react';
import {render} from 'react-dom';
import {HashRouter} from "react-router-dom";
import {Provider} from 'react-redux';
import store from './store';

import './js/base';
import style from './scss/base.scss';

import App from './App';

let rootElement = document.getElementById('app');
rootElement.className = style.app;

render(
    (<Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>),
    rootElement);
