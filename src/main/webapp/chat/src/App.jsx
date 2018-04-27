import {Route, Switch, BrowserRouter} from 'react-router-dom';

import React from "react";
import Chat from "./chat/Chat";
import ChangeUser from "./ChangeUser";

import 'bootstrap/dist/css/bootstrap.min.css';

export default () => <BrowserRouter>
    <div className="d-flex flex-column" style={{height: 100 + "vh"}}>
        <nav className="navbar navbar-light bg-light flex-shrink-0">
            <a className="navbar-brand">tmpchat</a>

        </nav>
        <div className="container-fluid d-flex flex-grow-1">
            <Switch>
                <Route path="/changeUser" component={ChangeUser}/>
                <Route path="/" component={Chat}/>
            </Switch>
        </div>
    </div>
</BrowserRouter>;

