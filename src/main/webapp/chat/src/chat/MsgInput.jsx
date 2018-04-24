
import React from 'react';
//
// function stringifyKeyboardEvent(e) {
//     return JSON.stringify({
//         altKey: e.altKey,
//         charCode: e.charCode,
//         code: e.code,
//         ctrlKey: e.ctrlKey,
//         isComposing: e.isComposing,
//         key: e.key,
//         keyCode: e.keyCode,
//         location: e.location,
//         metaKey: e.metaKey,
//         repeat: e.repeat,
//         shiftKey: e.shiftKey,
//         which: e.which
//     });
// }

class MsgInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: ""
        };
        this.text = React.createRef();
    }

    onMsgChange = e => this.setState({ msg: e.target.value });

    onPost = e => {
        if (e) {
            e.preventDefault();
        }
        if (this.state.msg) {
            this.props.onPost(this.state.msg);
            this.setState({ msg: "" });
        }
    };


    onKeyDown = e => {
        const t = this.text.current;
        if (e.which === 13) {
            if (e.shiftKey) {

                t.value += "\n";
                t.scrollTop = t.scrollHeight;

            } else {
                this.onPost();
            }
            e.preventDefault();
        }

    };

    // onKeyUp = e => console.log("keyUp " + stringifyKeyboardEvent(e));
    // onKeyPress = e => console.log("keyPress " + stringifyKeyboardEvent(e));

    render() {
        return <form onSubmit={this.onPost}>
            <div className="input-group mb-3">
                <textarea ref={this.text} className="form-control" onChange={this.onMsgChange} value={this.state.msg}
                          style={{resize: "none"}}
                          onKeyDown={this.onKeyDown} placeholder="Type your message here"/>
                <div className="input-group-append">
                    <button className="btn btn-primary" type="submit">Send</button>
                </div>
            </div>
        </form>;
    }

}

export default MsgInput;