import React from 'react';
import moment from "moment";
import classnames from 'classnames';

class Msg extends React.Component {

    constructor(props) {
        super(props);
        this.state = { live: 1 };
    }

    componentDidMount() {
        this.timerId = setInterval(() => {

            const live = Math.min(1, 1 - (Date.now() - this.props.msg.time) / 60000);
            if (live < 0) {
                this.props.onRemove(this.props.msg);
                return;
            }

            this.setState({ live: Math.sqrt(live) });

        }, 100);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    render() {
        const { msg, user } = this.props;
        return <div className={classnames("msg", "msg-" + msg.type)} style={{opacity: this.state.live}}>
            <span className="time">{moment(msg.time).format('DD.MM.YYYY HH:mm:ss.SSS')}</span> { msg.user && <span className={classnames("user", user.id === msg.user.id && "me")}>{msg.user.name}</span> } <span className="text">{msg.text}</span>
        </div>;
    }

}

export default Msg;
