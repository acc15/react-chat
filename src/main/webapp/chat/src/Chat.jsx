import React, {Component} from 'react';

import './Chat.css';
import moment from "moment";
import {withCookies} from 'react-cookie';
import {Link, Redirect} from "react-router-dom";

class Chat extends Component {

    constructor(props) {
        super(props);

        this.user = this.props.cookies.get("user");

        this.state = {
            msg: "",
            msgs: []
        };
    }

    componentDidMount() {
        const url = `${window.location.protocol.indexOf("https") >= 0 ? "wss": "ws"}://${window.location.host}/api/chat?user=${this.user}`;
        this.ws = new WebSocket(url);
        this.ws.onopen = () => console.log("ws open");
        this.ws.onclose = () => console.log("ws close");
        this.ws.onmessage = this.onMsgRecv;
    }

    componentWillUnmount() {
        this.ws.close();
    }

    onMsgChange = e => this.setState({ msg: e.target.value });

    onMsgSend = e => {
        e.preventDefault();
        this.ws.send(JSON.stringify({ user: this.user, text: this.state.msg }));
        this.setState({ msg: "" });
    };

    onMsgRecv = e => {
        const msg = JSON.parse(e.data);
        setTimeout(() => this.setState(prevState => ({msgs: prevState.msgs.filter(m => m.id !== msg.id)})), 60000);
        this.setState({ msgs: this.state.msgs.concat(msg) });
    };

    render() {
        if (!this.user) {
            return <Redirect to="/changeUser"/>
        }

        return <div>
            <form onSubmit={this.onMsgSend}>
                <div>
                    Hi, {this.user} (<Link to="/changeUser">change name</Link>)
                </div>
                <div>
                    {
                        this.state.msgs.map(msg =>
                            <div key={msg.time} className="msg">
                                <span className="timestamp">{moment(msg.time).format('DD.MM.YYYY HH:mm:ss.SSS')}</span> <span className="user">{msg.user}</span> {msg.text}
                            </div>
                        )
                    }
                </div>
                <div>
                    <label htmlFor="msg">Message: </label>
                    <input id="msg" type="text" onChange={this.onMsgChange} value={this.state.msg}/>
                    <button type="submit">Send</button>
                </div>
            </form>
        </div>;
    }
}

export default withCookies(Chat);
