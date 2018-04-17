import React from 'react';
import App from './App';
import { CookiesProvider } from 'react-cookie';

export default () => <CookiesProvider><App/></CookiesProvider>;