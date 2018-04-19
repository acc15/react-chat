import React from 'react';
import moment from "moment";

export default ({ msg }) => <div className="message">
    <span className="time">{moment(msg.time).format('DD.MM.YYYY HH:mm:ss.SSS')}</span> <span className="user">{msg.user}</span> {msg.text}
</div>;
