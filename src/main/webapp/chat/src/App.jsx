import {
    BrowserRouter,
    Redirect,
    Route,
    Switch
} from 'react-router-dom';

import React from "react";
import Chat from "./Chat";
import Login from "./Login";
import { withCookies } from 'react-cookie';

export default withCookies(({cookies}) => <BrowserRouter>
    <Switch>
        <Route path="/login" render={({ history }) => <Login user={cookies.get("user") || ""} onSubmit={user => {
                cookies.set("user", user);
                history.push("/");
            }}/>
        }/>
        <Route path="/" render={() =>
            cookies.get("user") ? <Chat user={cookies.get("user")}/> : <Redirect to="/login"/>
        }/>
    </Switch>
</BrowserRouter>);

