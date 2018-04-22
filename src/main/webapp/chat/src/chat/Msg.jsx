import React from 'react';
import moment from "moment";
import classnames from 'classnames';

export default ({ user, msg }) => <div className="msg">
    <span className="time">{moment(msg.time).format('DD.MM.YYYY HH:mm:ss.SSS')}</span> { msg.user && <span className={classnames("user", user.id === msg.user.id && "me")}>{msg.user.name}</span> } {msg.text}
</div>;
