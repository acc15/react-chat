import React from 'react';

import Msg from "./Msg";

class MsgList extends React.Component {

    constructor(props) {
        super(props);
        this.msgPanel = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.msgs.length >= prevProps.msgs.length) {
            this.msgPanel.current.scrollTop = this.msgPanel.current.scrollHeight;
        }
    }

    render() {
        return <div className="card h-100">
            <div className="card-header">Messages</div>
            <div className="card-body overflow-y-auto" ref={this.msgPanel}>
                { this.props.msgs.map(msg => <Msg key={msg.id} user={this.props.user} msg={msg} onRemove={this.onMsgRemove}/>) }
            </div>
        </div>;
    }
}

export default MsgList;

