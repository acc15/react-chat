import React from 'react';


class NotificationSwitch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allowed: false
        };
    }

    componentDidMount() {
        this.timerId = setInterval(() => this.setState({allowed: this.props.notifications.isAllowed()}), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    render() {
        const notifications = this.props.notifications;
        return <div className="nt-switch">
            <input id="nt-check"
                   checked={notifications.isEnabled()}
                   onChange={e => notifications.setEnabled(e.target.checked)}
                   disabled={!notifications.isAllowed()}
                   type="checkbox"/>
            <label htmlFor="nt-check">Notifications</label> {!notifications.isSupported() ?
            <span className="badge badge-warning">not supported by browser</span> :
            !notifications.isAllowed() ? <span className="badge badge-info">not allowed by user</span> : null}
        </div>;
    }
}

export default NotificationSwitch;
