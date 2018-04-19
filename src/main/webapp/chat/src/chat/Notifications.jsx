import React from 'react';


const withNotifications = (Delegate) => class NotificationsHOC extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            enabled: true
        };

        const self = this;
        class NotificationsAPI {

            get supported() {
                return Boolean(window.Notification);
            }

            get enabled() {
                return self.state.enabled;
            }

            set enabled(val) {
                self.setState({ enabled: val });
            }

            get allowed() {
                return window.Notification.permission === "granted";
            }

            requestPermissionIfDefault() {
                if (!this.supported) {
                    return false;
                }
                switch (window.Notification.permission) {
                    case "default":
                        window.Notification.requestPermission();
                        return false;

                    case "denied":
                        return false;

                    case "granted":
                        return true;

                    default:
                        console.log(`Unknown Notification.permission === ${window.Notification.permission}`);
                        break;
                }
            }


            notify(opts) {
                if (!this.supported) {
                    return;
                }
                if (!this.requestPermissionIfDefault()) {
                    return;
                }
                if (!this.enabled) {
                    return;
                }
                new Notification(opts.title, opts);
            }
        }

        this.notifications = new NotificationsAPI();

    }

    componentDidMount() {
        this.notifications.requestPermissionIfDefault();
    }

    render() {
        return <Delegate {...this.props} notifications={this.notifications}/>
    }

};

export default withNotifications;