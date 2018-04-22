import {Route, Switch} from 'react-router-dom';

import React from "react";
import Chat from "./chat/Chat";
import ChangeUser from "./ChangeUser";

export default () => <Switch>
        <Route path="/changeUser" component={ChangeUser}/>
        <Route path="/" component={Chat}/>
    </Switch>;

