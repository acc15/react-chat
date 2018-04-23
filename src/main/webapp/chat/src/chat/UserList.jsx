import React from 'react';

const UserList = ({users, user}) => <div className="card h-100">
    <div className="card-header">Users</div>
    <div className="card-body overflow-y-auto">
        { users.map(u => <div key={u.id}>{ u.name }</div>) }
    </div>
</div>;

export default UserList;