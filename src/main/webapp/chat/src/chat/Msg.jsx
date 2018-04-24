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

    renderText(text) {
        return text.split("").map((c, i) => c === "\n" ? <br key={i}/> : c);
    }

    render() {
        const { msg, user } = this.props;
        return <div className={classnames("msg", "msg-" + msg.type)} style={{opacity: this.state.live}}>
            <div className="row">
                <div className="col-2">
                    <span className="time">{moment(msg.time).format('DD.MM.YYYY HH:mm:ss.SSS')}</span> { msg.user && <span className={classnames("user", user.id === msg.user.id && "me")}>{msg.user.name}</span> }
                </div>
                <div className="col">
                    <span className="text">{this.renderText(msg.text)}</span>
                </div>
            </div>
        </div>;
    }

}

export default Msg;
