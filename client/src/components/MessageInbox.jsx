import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const MessageInbox = ({ currentUserId, conversationId, userName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [reactionMenuVisibleFor, setReactionMenuVisibleFor] = useState(null);
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

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await axios.put(`/api/messages/${messageId}/read`);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (err) {
      console.error("Erreur lors du marquage comme lu", err);
    }
  };

  const handleReact = async (messageId, emoji) => {
    try {
      await axios.post(`/api/messages/react/${messageId}`, {
        userId: currentUserId,
        emoji,
      });

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl shadow-lg overflow-hidden bg-gray-50 border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between border-b border-blue-700">
        <div className="flex items-center space-x-2">
          <div className="bg-white rounded-full p-1 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg">{userName}</h2>
            <p className="text-xs text-blue-100">En ligne</p>
          </div>
        </div>
        <div>
          <button className="p-2 rounded-full hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Section - Hauteur réduite */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-blue-50 to-gray-50" style={{ maxHeight: "60vh" }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">Aucun message. Commencez la conversation!</p>
          </div>
        )}
        
        {messages.map((msg, i) => {
          const isMine = (msg.sender?._id || msg.sender) === currentUserId;
          const isConsecutive = i > 0 && (messages[i-1].sender?._id || messages[i-1].sender) === (msg.sender?._id || msg.sender);
          
          return (
            <div
              key={i}
              onClick={() => handleMarkAsRead(msg._id)}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3 group`}
            >
              {!isMine && !isConsecutive && (
                <div className="flex-shrink-0 mr-2 mt-1">
                  {msg.sender?.avatar ? (
                    <img
                      src={msg.sender.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                      {userName?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
              )}

              <div className={`relative ${isMine ? 'ml-8' : 'mr-8'}`} style={{ maxWidth: "70%" }}>
                {!isMine && !isConsecutive && (
                  <div className="text-xs text-gray-500 ml-2 mb-1">{msg.sender?.name || userName || 'Utilisateur'}</div>
                )}
                
                <div className="relative">
                  <div
                    className={`relative px-3 py-2 rounded-xl shadow-sm ${
                      isMine 
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
                    
                    <div className={`flex items-center mt-1 text-xs ${isMine ? 'text-blue-100' : 'text-gray-400'} justify-end`}>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && (
                        <span className="ml-1">
                          {msg.isRead ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Bouton de réaction toujours visible */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReactionMenuVisibleFor(reactionMenuVisibleFor === msg._id ? null : msg._id);
                    }}
                    className={`absolute ${isMine ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-y-1/2 
                      bg-white border border-gray-200 p-1 rounded-full shadow-sm hover:bg-gray-100`}
                    style={{ marginLeft: isMine ? "-8px" : "", marginRight: !isMine ? "-8px" : "" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  {/* Menu de réactions */}
                  {reactionMenuVisibleFor === msg._id && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute z-10 bg-white rounded-full py-1.5 px-2 shadow-lg border border-gray-200 flex space-x-2"
                      style={{ 
                        [isMine ? 'right' : 'left']: '50%', 
                        transform: 'translateX(-50%)', 
                        top: '-30px'
                      }}
                    >
                      {['❤️', '👍', '😂', '😮', '😢', '😡'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            handleReact(msg._id, emoji);
                            setReactionMenuVisibleFor(null);
                          }}
                          className="hover:scale-125 transform transition-transform duration-150 focus:outline-none"
                        >
                          <span className="text-lg">{emoji}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Affichage des réactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`flex mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className="bg-white shadow-sm rounded-full px-2 py-0.5 border border-gray-200">
                      {Array.from(new Set(msg.reactions.map(r => r.emoji))).map((emoji, i) => {
                        const count = msg.reactions.filter(r => r.emoji === emoji).length;
                        return (
                          <span key={i} className="mr-1 last:mr-0 text-sm">
                            {emoji}{count > 1 && <sup className="text-xs ml-0.5 text-gray-500">{count}</sup>}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-full p-1 pr-3 shadow-inner">
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Écrire un message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 ml-2 py-2 px-3 bg-transparent outline-none text-gray-700"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`rounded-full p-2 focus:outline-none ${
              newMessage.trim() 
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInbox;