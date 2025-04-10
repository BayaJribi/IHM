import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const MessageInbox = ({ currentUserId, conversationId, userName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/by-conversation/${conversationId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Erreur chargement messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post('/api/messages/send', {
        sender: currentUserId,
        content: newMessage,
        conversationId,
      });
      setMessages(prev => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("❌ Erreur envoi message :", err);
    }
  };

  const handleReact = async (messageId, emoji) => {
    try {
      await axios.post(`/api/messages/react/${messageId}`, {
        userId: currentUserId,
        emoji,
      });

      // Mise à jour locale
      setMessages(prevMessages =>
        prevMessages.map((msg) => {
          if (msg._id === messageId) {
            const filteredReactions = (msg.reactions || []).filter(
              (r) => r.userId?.toString() !== currentUserId
            );
            return {
              ...msg,
              reactions: [...filteredReactions, { userId: currentUserId, emoji }]
            };
          }
          return msg;
        })
      );
    } catch (err) {
      console.error("Erreur réaction :", err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid #ccc',
      borderRadius: 12,
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '15px 20px',
        backgroundColor: '#0d6efd',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '18px',
        borderBottom: '1px solid #ccc'
      }}>
        💬 Conversation avec <span>{userName}</span>
      </div>

      <div style={{
        flex: 1,
        padding: 20,
        overflowY: 'auto',
        backgroundColor: '#f0f2f5'
      }}>
        {messages.map((msg, i) => {
          const isMine = (msg.sender?._id || msg.sender) === currentUserId;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: isMine ? 'flex-end' : 'flex-start',
                marginBottom: 12
              }}
            >
              <div style={{
                backgroundColor: isMine ? '#d1e7dd' : '#ffffff',
                color: '#333',
                padding: '10px 14px',
                borderRadius: 16,
                maxWidth: '70%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.85em', marginBottom: 4 }}>
                  {msg.sender?.name || (isMine ? 'Moi' : 'Utilisateur inconnu')}
                </div>
                <div>{msg.content}</div>

                {/* Réactions affichées */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div style={{ fontSize: 18, marginTop: 5 }}>
                    {msg.reactions.map((r, i) => (
                      <span key={i} style={{ marginRight: 5 }}>{r.emoji}</span>
                    ))}
                  </div>
                )}

                {/* Emojis cliquables */}
                <div style={{
                  fontSize: 20,
                  marginTop: 6,
                  display: 'flex',
                  gap: 6,
                  cursor: 'pointer',
                  opacity: 0.8
                }}>
                  {['❤️', '😂', '👍'].map((emoji) => (
                    <span
                      key={emoji}
                      onClick={() => handleReact(msg._id, emoji)}
                      style={{
                        transition: 'transform 0.2s',
                        userSelect: 'none'
                      }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.3)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1.0)'}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone d'envoi */}
      <div style={{
        display: 'flex',
        borderTop: '1px solid #ddd',
        padding: 14,
        backgroundColor: '#fff'
      }}>
        <input
          type="text"
          placeholder="Écrire un message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            border: '1px solid #ccc',
            borderRadius: 8,
            fontSize: 16
          }}
        />
        <button
          onClick={handleSend}
          style={{
            marginLeft: 10,
            backgroundColor: '#0d6efd',
            color: '#fff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#0b5ed7'}
          onMouseLeave={e => e.target.style.backgroundColor = '#0d6efd'}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default MessageInbox;
