import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import MessageInbox from '../components/MessageInbox';
import ConversationList from '../components/ConversationList';
import NewConversationModal from '../components/NewConversationModal';
import NewGroupModal from '../components/NewGroupModal'; // adapte le chemin si besoin

const ChatPage = () => {
  const currentUser = useSelector((state) => state.auth.userData);
  const currentUserId = currentUser?._id;

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [userName, setUserName] = useState("");

  const handleConversationCreated = () => {
    setRefreshTrigger(!refreshTrigger);
    setShowModal(false);
  };

  const handleGroupCreated = () => {
    setRefreshTrigger(!refreshTrigger);
    setShowGroupModal(false);
  };

  if (!currentUserId) return <div>Veuillez vous connecter pour accéder à la messagerie.</div>;

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <button onClick={() => setShowModal(true)} style={{ margin: 10 }}>
          + Nouvelle conversation
        </button>
        <button onClick={() => setShowGroupModal(true)} style={{ margin: 10 }}>
          + Nouveau groupe
        </button>

        <ConversationList
          currentUserId={currentUserId}
          onSelectConversation={setSelectedConversationId}
          onSelectUserName={setUserName}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Messagerie {userName && <span>avec {userName}</span>}</h2>
        {selectedConversationId ? (
          <MessageInbox
            currentUserId={currentUserId}
            conversationId={selectedConversationId}
            userName={userName}
          />
        ) : (
          <p>Sélectionnez une conversation à gauche.</p>
        )}
      </div>

      {showModal && (
        <NewConversationModal
          currentUserId={currentUserId}
          onClose={() => setShowModal(false)}
          onConversationCreated={handleConversationCreated}
        />
      )}

      {showGroupModal && (
        <NewGroupModal
          currentUserId={currentUserId}
          onClose={() => setShowGroupModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
};

export default ChatPage;
