import React from 'react';

import {withCookies} from 'react-cookie';
import {Link, Redirect} from "react-router-dom";
import Message from "./Msg";
import MsgInput from "./MsgInput";
import NotificationSwitch from "./NotificationSwitch";
import withNotifications from "./Notifications";

function logClose(status) {
    console.log(`Connection closed: {code: ${status.code}, reason: ${status.reason}. wasClean: ${status.wasClean}}`);
}

class Chat extends React.Component {

    constructor(props) {
        super(props);

        const proto = window.location.protocol.indexOf("https") >= 0 ? "wss" : "ws";
        this.url = `${proto}://${window.location.host}/api/chat`;

        this.state = {
            msgs: [],
            users: []
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
        this.sendMessage({type: "PING"});
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
            case "INIT":
                this.setState({ users: msg.users });
                break;

            case "JOIN":
                this.userChange(msg, `${msg.user.name} joined`, users => users.concat(msg.user));
                break;

            case "LEAVE":
                this.userChange(msg, `${msg.user.name} leave`, users => users.filter(u => u.id !== msg.user.id));
                break;

            case "MSG":
                this.msg(msg);
                break;

            case "PONG":
                break;

            default:
                console.log(`Unknown frame received: ${e.data}`);
                break;
        }
    };

    userChange(msg, text, modifier) {
        this.setState(state => ({
            users: modifier(state.users),
            msgs: [...state.msgs, {id: msg.id, time: msg.time, text: text}] })
        );
        this.notify(text);
    }

    msg(msg) {
        this.setState(state => ({msgs: [...state.msgs, msg]}));
        if (msg.notify) {
            this.notify(msg.user.name, msg.text);
        }
    }

    notify(title, body) {
        this.props.notifications.notify({ title: title, body: body });
    }

    onMsgRemove = msg => this.setState(state => ({msgs: state.msgs.filter(m => m.id !== msg.id)}));

    render() {
        const { notifications, user } = this.props;

        return <div>
            <div className="row">
                <div className="col">Hi, {user.name} (<Link to="/changeUser">change name</Link>)</div>
            </div>
            <div className="row">
                <div className="col">
                    <NotificationSwitch notifications={notifications}/>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-8">
                    <div className="card mb-3">
                        <div className="card-header">
                            Messages
                        </div>
                        <div className="card-body">
                            { this.state.msgs.map(msg => <Message key={msg.id} user={user} msg={msg} onRemove={this.onMsgRemove}/>) }
                        </div>
                    </div>
                </div>
                <div className="col-sm">
                    <div className="card mb-3">
                        <div className="card-header">
                            Users
                        </div>
                        <div className="card-body">
                            { this.state.users.map(u => <div>{ u.name }</div>) }
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <MsgInput onPost={this.onMsgPost}/>
                </div>
            </div>
        </div>;
    }
}

const ChatWithNotifications = withNotifications(Chat);

export default withCookies(({cookies}) => {
    const user = cookies.get("user");
    return user ? <ChatWithNotifications user={user}/> : <Redirect to="/changeUser"/>;
});
