import React from 'react';


const withNotifications = (Delegate) => class NotificationsHOC extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            enabled: true
        };

        const self = this;
        class NotificationsAPI {

            isSupported() {
                return Boolean(window.Notification);
            }

            isAllowed() {
                return this.isSupported() && Notification.permission === "granted";
            }

            isEnabled() {
                return self.state.enabled;
            }

            setEnabled(val) {
                self.setState({ enabled: val });
            }

            notify(opts) {
                if (!this.isSupported()) {
                    return false;
                }
                switch (Notification.permission) {
                    case "default":
                        Notification.requestPermission();
                        return false;

                    case "denied":
                        return false;

                    case "granted":
                        break;

                    default:
                        console.log(`Unknown Notification.permission === ${window.Notification.permission}`);
                        return false;
                }
                if (!this.isEnabled()) {
                    return false;
                }
                new Notification(opts.title, opts);
                return true;
            }
        }

        this.notifications = new NotificationsAPI();

    }

    componentDidMount() {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }

    render() {
        return <Delegate {...this.props} notifications={this.notifications}/>
    }

};

export default withNotifications;