import React from "react";

import {withCookies} from 'react-cookie';
import {Redirect} from 'react-router-dom';

class ChangeUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.cookies.get("user") || "",
            submitted: false
        };
    }

    onLoginChange = e => this.setState({ user: e.target.value });

    onSubmit = e => {
        e.preventDefault();
        this.props.cookies.set("user", this.state.user);
        this.setState({ submitted: true });
    };

    render() {
        if (this.state.submitted) {
            return <Redirect to="/"/>
        }

        return <form onSubmit={this.onSubmit}>
            <label htmlFor="user">Nickname</label>
            <input id="user" type="text" value={this.state.user} onChange={this.onLoginChange}/>
            <button type="submit">OK</button>
        </form>;
    }

}

export default withCookies(ChangeUser);