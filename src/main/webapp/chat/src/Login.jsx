import React from "react";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user
        };
    }

    onLoginChange = e => this.setState({ user: e.target.value });

    render() {
        return <form onSubmit={() => this.props.onSubmit(this.state.user)}>
            <label htmlFor="user">Nickname</label>
            <input id="user" type="text" value={this.state.user} onChange={this.onLoginChange}/>
            <button type="submit">OK</button>
        </form>;
    }

}

export default Login;