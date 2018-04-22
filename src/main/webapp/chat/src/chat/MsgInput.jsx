
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
            <div className="input-group mb-3">
                <input type="text" className="form-control" onChange={this.onMsgChange} value={this.state.msg} placeholder="Type your message here"/>
                <div className="input-group-append">
                    <button className="btn btn-primary" type="submit">Send</button>
                </div>
            </div>
        </form>;
    }

}

export default MsgInput;