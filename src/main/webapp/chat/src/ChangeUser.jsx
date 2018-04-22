import React from "react";

import {withCookies} from 'react-cookie';
import {Redirect} from 'react-router-dom';
import {withAxios} from "react-axios";

class ChangeUser extends React.Component {

    constructor(props) {
        super(props);

        const userJson = props.cookies.get("user");
        const user = (userJson && userJson.id !== undefined) ? userJson : { id: null, name: "" };

        this.state = {
            user: user,
            submitted: false
        };
    }

    onLoginChange = e => {
        const val = e.target.value;
        this.setState(state => ({ user: { ...state.user, name: val } }));
    };

    onSubmit = e => {
        e.preventDefault();
        this.props.axios.post("auth", this.state.user).then(resp => {
            const authUser = resp.data;
            this.props.cookies.set("user", authUser);
            this.setState({ submitted: true });
        });
    };

    render() {
        if (this.state.submitted) {
            return <Redirect to="/"/>
        }

        return <form onSubmit={this.onSubmit}>
            <label htmlFor="user">Nickname</label>
            <input id="user" type="text" value={this.state.user.name} onChange={this.onLoginChange}/>
            <button type="submit">OK</button>
        </form>;
    }

}

export default withAxios(withCookies(ChangeUser));