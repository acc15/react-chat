import React from 'react';


const withNotifications = (Delegate) => class NotificationsHOC extends React.Component {

    constructor(props) {
        super(props);

        this.supported = Boolean(window.Notification);
        this.state = {
            enabled: true,
            allowed: this.isNotificationsAllowed()
        };

        const self = this;
        class NotificationsAPI {

            get supported() {
                return self.supported;
            }

            get enabled() {
                return self.state.enabled;
            }

            set enabled(val) {
                self.setState({ enabled: val });
            }

            get allowed() {
                return self.state.allowed;
            }

            notSupportedOrAllowed() {
                return !this.supported || !this.allowed;
            }

            requestPermissionIfDefault() {
                if (!self.supported) {
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

    isNotificationsAllowed() {
        return this.supported && window.Notification.permission === "granted";
    }

    componentDidMount() {
        this.notifications.requestPermissionIfDefault();
        this.permissionCheckerId = setInterval(() => this.setState({ allowed: this.isNotificationsAllowed() }), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.permissionCheckerId);
    }

    render() {
        return <Delegate {...this.props} notifications={this.notifications}/>
    }

};

export default withNotifications;