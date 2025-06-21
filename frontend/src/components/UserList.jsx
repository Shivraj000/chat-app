import React from 'react';

const UserList = ({ users, currentUser, onSelectUser, onLogout, loading, selectedUserId }) => {
  if (loading) {
    return <div style={styles.sidebar}>Loading users...</div>;
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.userInfo}>
        <h4>Welcome, {currentUser.fullName}</h4>
        <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
      </div>
      <h5>Users:</h5>
      {users.length === 0 && <p>No other users found.</p>}
      <ul style={styles.userListUl}>
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => onSelectUser(user)}
            style={{
              ...styles.userListItem,
              ...(selectedUserId === user._id ? styles.selectedUser : {})
            }}
          >
            {user.fullName} ({user.username})
            {/* Basic online/offline indicator could be added if backend supports it */}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    borderRight: '1px solid #ccc',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
  },
  userInfo: {
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  logoutButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
    marginTop: '5px',
  },
  userListUl: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    overflowY: 'auto', // For scrollable user list
  },
  userListItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    borderRadius: '4px',
    marginBottom: '5px',
  },
  selectedUser: {
    backgroundColor: '#007bff',
    color: 'white',
  }
};

export default UserList;
