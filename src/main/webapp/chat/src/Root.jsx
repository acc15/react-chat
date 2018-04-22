import React from 'react';
import App from './App';
import {CookiesProvider} from 'react-cookie';
import {AxiosProvider} from 'react-axios';
import axios from 'axios';

class Root extends React.Component {

    constructor(props) {
        super(props);
        this.axios = axios.create({
            baseURL: '/api/',
            timeout: 2000
        });
    }

    render() {
        return <AxiosProvider instance={this.axios}>
            <CookiesProvider>
                <App/>
            </CookiesProvider>
        </AxiosProvider>;
    }

}

export default Root;