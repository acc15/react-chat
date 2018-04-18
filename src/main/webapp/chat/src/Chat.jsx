import React, {Component} from 'react';

import './Chat.css';
import {withCookies} from 'react-cookie';
import {Link, Redirect} from "react-router-dom";
import Message from "./Message";

function logClose(status) {
    console.log(`Connection closed: {code: ${status.code}, reason: ${status.reason}. wasClean: ${status.wasClean}}`);
}

class Chat extends Component {

    constructor(props) {
        super(props);

        this.user = this.props.cookies.get("user");
        this.url = `${window.location.protocol.indexOf("https") >= 0 ? "wss": "ws"}://${window.location.host}/api/chat?user=${this.user}`;

        this.state = {
            msg: "",
            msgs: []
        };
    }

    componentDidMount() {
        this.connectWebSocket();
    }

    componentWillUnmount() {
        if (this.pingIntervalId) {
            clearInterval(this.pingIntervalId);
        }
        if (this.ws) {
            this.ws.onclose = logClose;
            this.ws.close();
        }
    }

    connectWebSocket() {
        if (!this.user) {
            return;
        }
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = this.onMsgRecv;
        this.ws.onopen = () => {
            console.log("Connection opened...");
            this.pingIntervalId = setInterval(() => this.sendPing(), 120000);
        };
        this.ws.onclose = e => {
            logClose(e);
            setTimeout(() => {
                console.log("Reconnecting...");
                this.connectWebSocket();
            }, 1000)
        };
    }

    sendPing() {
        this.sendMessage({ type: "PING" });
    }

    sendMessage(data) {
        const json = JSON.stringify(data);
        console.log(`Sending frame: ${json}`);
        this.ws.send(json);
    }

    onMsgChange = e => this.setState({ msg: e.target.value });

    onMsgPost = e => {
        e.preventDefault();
        this.sendMessage({ type: "POST", text: this.state.msg});
        this.setState({ msg: "" });
    };

    onMsgRecv = e => {
        console.log(`Received frame: ${e.data}`);
        const msg = JSON.parse(e.data);
        switch (msg.type) {
            case "MSG":
            case "NOTIFY":
                this.setState(state => ({msgs: [...state.msgs, msg]}));
                setTimeout(() => this.setState(state => ({msgs: state.msgs.filter(m => m.id !== msg.id)})), 60000);
                break;

            case "PONG":
                break;

            default:
                console.log(`Unknown frame received from server: ${e.data}`);
                break;
        }
    };

    render() {
        if (!this.user) {
            return <Redirect to="/changeUser"/>
        }

        return <div>
            <form onSubmit={this.onMsgPost}>
                <div>Hi, {this.user} (<Link to="/changeUser">change name</Link>)</div>
                <div>{ this.state.msgs.map(msg => <Message key={msg.time} msg={msg}/>) }</div>
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
