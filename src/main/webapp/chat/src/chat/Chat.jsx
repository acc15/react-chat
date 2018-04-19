import React, {Component} from 'react';

import './Chat.css';
import {withCookies} from 'react-cookie';
import {Link, Redirect} from "react-router-dom";
import Message from "./Msg";
import MsgInput from "./MsgInput";

function logClose(status) {
    console.log(`Connection closed: {code: ${status.code}, reason: ${status.reason}. wasClean: ${status.wasClean}}`);
}

class Chat extends Component {

    constructor(props) {
        super(props);

        const proto = window.location.protocol.indexOf("https") >= 0 ? "wss": "ws";
        this.url = `${proto}://${window.location.host}/api/chat?user=${this.props.user}`;

        this.state = {
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
        this.ws.onclose = logClose;
        this.ws.close();
    }

    connectWebSocket() {
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

    onMsgPost = msg => this.sendMessage({type: "POST", text: msg});

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
                console.log(`Unknown frame received: ${e.data}`);
                break;
        }
    };

    render() {
        return <div>
            <div>Hi, {this.props.user} (<Link to="/changeUser">change name</Link>)</div>
            <div>{ this.state.msgs.map(msg => <Message key={msg.id} msg={msg}/>) }</div>
            <div>
                <MsgInput onPost={this.onMsgPost}/>
            </div>
        </div>;
    }
}

const ChatEntry = ({ cookies }) => {
    const user = cookies.get("user");
    return user ? <Chat user={user}/> : <Redirect to="/changeUser"/>;
};

export default withCookies(ChatEntry);
