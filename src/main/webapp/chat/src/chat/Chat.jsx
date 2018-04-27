import React from 'react';

import {withCookies} from 'react-cookie';
import {Link, Redirect} from "react-router-dom";
import MsgList from "./MsgList";
import UserList from "./UserList";
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
        this.ws.close(4000, "leave");
    }

    connectWebSocket() {
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = this.onMsgRecv;
        this.ws.onopen = () => {
            console.log("Connection opened...");
            this.pingIntervalId = setInterval(() => this.sendPing(), 20000);
        };
        this.ws.onclose = e => {
            logClose(e);
            clearInterval(this.pingIntervalId);
            if (e.code === 4000) {
                return;
            }
            setTimeout(() => {
                console.log("Reconnecting...");
                this.connectWebSocket();
            }, 1000);
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

    onMsgPost = msg => {
        this.sendMessage({type: "POST", text: msg});
    };

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
            msgs: [...state.msgs, {type: msg.type, id: msg.id, time: msg.time, text: text}] })
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

        return <div className="d-flex flex-column flex-grow-1">
            <div className="d-flex flex-column flex-grow-1">
                <div>Hi, {user.name} (<Link to="/changeUser">change name</Link>)</div>
                <div><NotificationSwitch notifications={notifications}/></div>
                <div className="row flex-grow-1">
                    <div className="col-sm-9 order-last order-sm-first mb-3">
                        <MsgList msgs={this.state.msgs} user={user} onRemove={this.onMsgRemove}/>
                    </div>
                    <div className="col-sm order-first order-sm-last mb-3">
                        <UserList users={this.state.users}/>
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0">
                <MsgInput onPost={this.onMsgPost}/>
            </div>
        </div>;
    }
}

const ChatWithNotifications = withNotifications(Chat);

export default withCookies(({cookies}) => {
    const user = cookies.get("user");
    return user ? <ChatWithNotifications user={user}/> : <Redirect to="/changeUser"/>;
});
