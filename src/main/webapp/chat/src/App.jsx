import {Route, Switch, BrowserRouter} from 'react-router-dom';

import React from "react";
import Chat from "./chat/Chat";
import ChangeUser from "./ChangeUser";

import 'bootstrap/dist/css/bootstrap.min.css';

export default () => <BrowserRouter>
        <Switch>
            <Route path="/changeUser" component={ChangeUser}/>
            <Route path="/" component={Chat}/>
        </Switch>
</BrowserRouter>;

