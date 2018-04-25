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

        return <form onSubmit={this.onSubmit} className="form-inline">
            <label htmlFor="user">Nickname</label>
            <div className="input-group ml-1">
                <input id="user" type="text" className="form-control" value={this.state.user.name} onChange={this.onLoginChange}/>
                <span className="input-group-btn">
                    <button type="submit" className="btn btn-primary">OK</button>
                </span>
            </div>
        </form>;
    }

}

export default withAxios(withCookies(ChangeUser));