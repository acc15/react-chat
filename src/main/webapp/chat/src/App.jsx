import {Route, Switch, BrowserRouter} from 'react-router-dom';

import React from "react";
import Chat from "./chat/Chat";
import ChangeUser from "./ChangeUser";

import 'bootstrap/dist/css/bootstrap.min.css';

export default () => <BrowserRouter>
    <div className="container-fluid h-100">
        <Switch>
            <Route path="/changeUser" component={ChangeUser}/>
            <Route path="/" component={Chat}/>
        </Switch>
    </div>
</BrowserRouter>;

