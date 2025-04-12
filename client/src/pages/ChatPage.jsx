import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MessageInbox from '../components/MessageInbox';
import ConversationList from '../components/ConversationList';
import NewConversationModal from '../components/NewConversationModal';
import NewGroupModal from '../components/NewGroupModal';

const ChatPage = () => {
  const currentUser = useSelector((state) => state.auth.userData);
  const currentUserId = currentUser?._id;
  
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleConversationCreated = () => {
    setRefreshTrigger(!refreshTrigger);
    setShowModal(false);
  };

  const handleGroupCreated = () => {
    setRefreshTrigger(!refreshTrigger);
    setShowGroupModal(false);
  };

  const handleConversationSelect = (convId, name) => {
    setSelectedConversationId(convId);
    setUserName(name);
    
    // On mobile, hide the sidebar when a conversation is selected
    if (isMobileView) {
      setShowSidebar(false);
    }
  };

  if (!currentUserId) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💬</div>
          <h2 style={{ marginBottom: '20px', color: '#1a1a1a', fontSize: '24px' }}>
            Messagerie
          </h2>
          <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.5' }}>
            Veuillez vous connecter pour accéder à la messagerie et communiquer avec vos contacts.
          </p>
          <button style={{
            backgroundColor: '#0d6efd',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}>
            Se Connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      backgroundColor: '#f0f2f5',
      overflow: 'hidden'
    }}>
      {/* Sidebar with conversation list */}
      {showSidebar && (
        <div style={{
          width: isMobileView ? '100%' : '320px',
          borderRight: '1px solid #e1e4e8',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          boxShadow: isMobileView ? 'none' : '0 0 15px rgba(0,0,0,0.05)',
          zIndex: 5,
          position: isMobileView ? 'absolute' : 'relative',
          height: '100%'
        }}>
          {/* Sidebar Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e1e4e8',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ 
              margin: 0, 
              color: '#333',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Messages
            </h2>
            
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              {isMobileView && (
                <button 
                  onClick={() => setShowSidebar(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '22px',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            padding: '12px 16px',
            gap: '8px',
            borderBottom: '1px solid #e1e4e8'
          }}>
            <button 
              onClick={() => setShowModal(true)} 
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#0d6efd',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(13, 110, 253, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>➕</span> Nouvelle conversation
            </button>
            
            <button 
              onClick={() => setShowGroupModal(true)}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(108, 117, 125, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>👥</span> Nouveau groupe
            </button>
          </div>
          
          {/* Conversation List */}
          <div style={{
            flex: 1,
            overflowY: 'auto'
          }}>
            <ConversationList
              currentUserId={currentUserId}
              onSelectConversation={(id) => handleConversationSelect(id, userName)}
              onSelectUserName={setUserName}
              refreshTrigger={refreshTrigger}
              selectedConversationId={selectedConversationId}
            />
          </div>
          
          {/* User Profile Preview */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #e1e4e8',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#0d6efd',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginRight: '12px'
            }}>
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div style={{
              flex: 1,
              overflow: 'hidden'
            }}>
              <div style={{
                fontWeight: '500',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentUser?.name || 'Utilisateur'}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#666',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentUser?.email || ''}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Chat Area */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e1e4e8',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {isMobileView && !showSidebar && (
              <button 
                onClick={() => setShowSidebar(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px'
                }}
              >
                ☰
              </button>
            )}
            
            {selectedConversationId ? (
              <>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {userName?.charAt(0) || '?'}
                </div>
                <div>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {userName}
                  </h2>
                  <div style={{
                    fontSize: '13px',
                    color: '#28a745',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#28a745'
                    }}></span>
                    En ligne
                  </div>
                </div>
              </>
            ) : (
              <h2 style={{ 
                margin: 0, 
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Messagerie
              </h2>
            )}
          </div>
        </div>
        
        {/* Message Area */}
        <div style={{ 
          flex: 1,
          padding: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: selectedConversationId ? 'flex-start' : 'center',
          alignItems: selectedConversationId ? 'stretch' : 'center'
        }}>
          {selectedConversationId ? (
            <div style={{ height: '100%' }}>
              <MessageInbox
                currentUserId={currentUserId}
                conversationId={selectedConversationId}
                userName={userName}
              />
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              maxWidth: '400px',
              padding: '20px'
            }}>
              <div style={{ 
                fontSize: '80px',
                marginBottom: '20px',
                opacity: 0.7
              }}>
                💬
              </div>
              <h3 style={{ 
                marginBottom: '16px',
                color: '#555',
                fontWeight: '500'
              }}>
                Bienvenue dans votre messagerie
              </h3>
              <p style={{
                color: '#777',
                lineHeight: '1.5',
                marginBottom: '24px'
              }}>
                Sélectionnez une conversation dans la liste à gauche ou créez une nouvelle conversation pour commencer à discuter.
              </p>
              <button 
                onClick={() => setShowModal(true)}
                style={{
                  backgroundColor: '#0d6efd',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '16px',
                  boxShadow: '0 2px 8px rgba(13, 110, 253, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                Nouvelle conversation
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <NewConversationModal
            currentUserId={currentUserId}
            onClose={() => setShowModal(false)}
            onConversationCreated={handleConversationCreated}
          />
        </div>
      )}
      
      {showGroupModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <NewGroupModal
            currentUserId={currentUserId}
            onClose={() => setShowGroupModal(false)}
            onGroupCreated={handleGroupCreated}
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;