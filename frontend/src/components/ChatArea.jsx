import React, { useState, useEffect, useRef } from 'react';
import { sendMessage as apiSendMessage } from '../api';

const ChatArea = ({ currentUser, selectedUser, messages, loadingMessages, onMessageSent, error }) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const messagesEndRef = useRef(null); // To scroll to bottom

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages change

  if (!selectedUser) {
    return (
      <div style={styles.chatArea}>
        <p style={styles.placeholderText}>Select a user to start chatting.</p>
        {error && <p style={{color: 'red'}}>Error loading previous chat: {error}</p>}
      </div>
    );
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setSendError('');
    try {
      const sentMessage = await apiSendMessage(selectedUser._id, newMessage.trim());
      setNewMessage('');
      onMessageSent(sentMessage); // Pass the newly sent message object to the callback
    } catch (err) {
      setSendError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.chatArea}>
      <div style={styles.chatHeader}>
        <h3>Chat with {selectedUser.fullName}</h3>
      </div>

      {error && !loadingMessages && <p style={{color: 'red', textAlign: 'center'}}>Error: {error}</p>}

      <div style={styles.messagesContainer}>
        {loadingMessages ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                ...styles.messageBubble,
                ...(msg.senderId === currentUser._id ? styles.myMessage : styles.theirMessage),
              }}
            >
              <p style={styles.messageText}>{msg.message}</p>
              <span style={styles.timestamp}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} /> {/* Element to scroll to */}
      </div>

      <form onSubmit={handleSendMessage} style={styles.messageForm}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          style={styles.messageInput}
        />
        <button type="submit" disabled={sending} style={styles.sendButton}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
      {sendError && <p style={{ color: 'red', fontSize: '0.9em', textAlign: 'center' }}>{sendError}</p>}
    </div>
  );
};

const styles = {
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0px', // No padding, header/footer will manage
    backgroundColor: '#ffffff',
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '1.2em',
    color: '#777',
  },
  chatHeader: {
    padding: '15px 20px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f9f9f9',
  },
  messagesContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto', // Important for scrolling
    display: 'flex',
    flexDirection: 'column',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px 15px',
    borderRadius: '18px',
    marginBottom: '10px',
    wordWrap: 'break-word',
  },
  myMessage: {
    backgroundColor: '#007bff',
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '5px',
  },
  theirMessage: {
    backgroundColor: '#e9ecef',
    color: '#333',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '5px',
  },
  messageText: {
    margin: 0,
    padding: 0,
  },
  timestamp: {
    fontSize: '0.75em',
    color: 'inherit',
    opacity: 0.7,
    display: 'block',
    marginTop: '5px',
    textAlign: 'right',
  },
  messageForm: {
    display: 'flex',
    padding: '15px',
    borderTop: '1px solid #eee',
    backgroundColor: '#f9f9f9',
  },
  messageInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    marginRight: '10px',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};

export default ChatArea;
