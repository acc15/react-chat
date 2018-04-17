import React, {Component} from 'react';

import './Chat.css';
import moment from "moment";
import {Link} from "react-router-dom";

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: "",
            msgs: []
        };
    }

    componentDidMount() {
        const url = (window.location.protocol.indexOf("https") >= 0 ? "wss": "ws") + "://" + window.location.host + "/api/chat";
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
        this.ws.send(JSON.stringify({ user: this.props.user, text: this.state.msg }));
        this.setState({ msg: "" });
    };

    onMsgRecv = e => this.setState({ msgs: JSON.parse(e.data) });

    render() {
        return <div>
            <form onSubmit={this.onMsgSend}>
                <div>
                    Hi, {this.props.user} (<Link to="/login">change name</Link>)
                </div>
                <div>
                    { this.state.msgs.map(msg =>
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

export default Chat;
