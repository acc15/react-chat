import {BrowserRouter, Route, Switch} from 'react-router-dom';

import React from "react";
import Chat from "./Chat";
import ChangeUser from "./ChangeUser";

export default () => <BrowserRouter>
    <Switch>
        <Route path="/changeUser" component={ChangeUser}/>
        <Route path="/" component={Chat}/>
    </Switch>
</BrowserRouter>;

