
import React from 'react';

class MsgInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: ""
        };
    }

    onMsgChange = e => this.setState({ msg: e.target.value });

    onPost = e => {
        e.preventDefault();
        if (this.state.msg) {
            this.props.onPost(this.state.msg);
            this.setState({ msg: "" });
        }
    };

    render() {
        return <form onSubmit={this.onPost}>
            <input id="msg" type="text" onChange={this.onMsgChange} value={this.state.msg} placeholder="Type your message here"/>
            <button type="submit">Send</button>
        </form>;
    }

}

export default MsgInput;