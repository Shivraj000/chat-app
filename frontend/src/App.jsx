import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import UserList from './components/UserList'; // We'll create this next
import ChatArea from './components/ChatArea'; // We'll create this next
import { getUsers, getMessages, logoutUser as apiLogout } from './api';
import './index.css'; // Assuming some global styles might be here

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');

  // Effect to check for persisted user (e.g., from localStorage) on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('chatUser'); // Clear corrupted data
      }
    }
  }, []);

  // Effect to fetch users when currentUser changes (i.e., after login)
  useEffect(() => {
    if (currentUser) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        setError('');
        try {
          const fetchedUsers = await getUsers();
          // Filter out the current user from the list
          setUsers(fetchedUsers.filter(user => user._id !== currentUser._id));
        } catch (err) {
          setError(err.message || 'Failed to fetch users');
          // Potentially token expired, consider logout
          if (err.message.toLowerCase().includes("unauthorized") || err.message.toLowerCase().includes("token")) {
            handleLogout(false); // Don't show logout success message
          }
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    } else {
      setUsers([]); // Clear users if no current user
    }
  }, [currentUser]);

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('chatUser', JSON.stringify(userData)); // Persist user
    setError('');
  };

  const handleLogout = async (showNotification = true) => {
    try {
      await apiLogout();
      if (showNotification) alert('Logged out successfully');
    } catch (err) {
      if (showNotification) alert('Logout failed: ' + err.message);
      // Still clear user state even if API logout fails
    } finally {
      setCurrentUser(null);
      setSelectedUser(null);
      setMessages([]);
      setUsers([]);
      localStorage.removeItem('chatUser'); // Clear persisted user
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setLoadingMessages(true);
    setError('');
    try {
      const fetchedMessages = await getMessages(user._id);
      setMessages(fetchedMessages);
    } catch (err) {
      setError(err.message || 'Failed to fetch messages');
      setMessages([]); // Clear messages on error
    } finally {
      setLoadingMessages(false);
    }
  };

  // This function will be passed to ChatArea to update messages after sending
  // It now expects the newly sent message object as an argument.
  const handleNewMessage = (newMessageObject) => {
    if (newMessageObject && selectedUser && newMessageObject.receiverId === selectedUser._id || newMessageObject.senderId === selectedUser._id) {
      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
    } else if (newMessageObject && currentUser && newMessageObject.senderId === currentUser._id) {
      // If current user sent it, add it even if selectedUser isn't the receiver (e.g. message to self, or if UI allows sending to non-selected)
       setMessages((prevMessages) => [...prevMessages, newMessageObject]);
    }
    // We don't need to setLoadingMessages or setError here as this is an optimistic update based on a successful send.
    // The ChatArea component handles send errors locally.
  };


  if (!currentUser) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', border: '1px solid #ccc' }}>
      <UserList
        users={users}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onLogout={handleLogout}
        loading={loadingUsers}
        selectedUserId={selectedUser?._id}
      />
      <ChatArea
        currentUser={currentUser}
        selectedUser={selectedUser}
        messages={messages}
        loadingMessages={loadingMessages}
        onMessageSent={handleNewMessage} // Pass the new handler function
        error={error} // Pass error to display if relevant
      />
      {/* Global error display can be added here if needed */}
      {/* {error && <p style={{color: 'red', position: 'fixed', bottom: '10px', left: '10px'}}>Error: {error}</p>} */}
    </div>
  );
}

export default App;
