import React, { useEffect, useState } from 'react';
import axios from '../axios'; // ✅ instance configurée avec token

const ConversationList = ({
  currentUserId,
  onSelectConversation,
  onSelectUserName,
  refreshTrigger,
  onDelete // Optionnel : fonction personnalisée de suppression
}) => {
  const [conversations, setConversations] = useState([]);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`/api/conversations/${currentUserId}`);
        setConversations(res.data);

        const otherUserIds = new Set();
        res.data.forEach(conv => {
          conv.members.forEach(id => {
            if (id !== currentUserId) otherUserIds.add(id);
          });
        });

        const userRequests = Array.from(otherUserIds).map(id =>
          axios.get(`/api/users/${id}`)
        );

        const responses = await Promise.all(userRequests);
        const map = {};
        responses.forEach(res => {
          map[res.data._id] = res.data.name;
        });

        setUserMap(map);
      } catch (err) {
        console.error("❌ Erreur chargement conversations ou utilisateurs :", err);
      }
    };

    if (currentUserId) fetchConversations();
  }, [currentUserId, refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("❗ Voulez-vous vraiment supprimer cette conversation ?")) return;
    try {
      await axios.delete(`/api/conversations/${id}`);
      setConversations(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error("Erreur suppression conversation:", err);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div style={{
      width: '250px',
      borderRight: '1px solid #ccc',
      height: '100vh',
      overflowY: 'auto',
      padding: '10px'
    }}>
      <h4 style={{ marginBottom: 15 }}>Conversations</h4>

      {conversations.map((conv) => {
        const isGroup = conv.isGroup;
        const otherUserIds = conv.members.filter(id => id !== currentUserId);

        const displayName = isGroup
          ? `👥 Groupe: ${conv.name}`
          : "💬 Avec : " + otherUserIds
              .map(id => userMap[id] || "Utilisateur inconnu")
              .join(", ");

        return (
          <div
            key={conv._id}
            style={{
              padding: '10px',
              marginBottom: '5px',
              backgroundColor: '#f1f1f1',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span
              onClick={() => {
                onSelectConversation(conv._id);
                onSelectUserName(displayName);
              }}
              style={{ flex: 1 }}
            >
              {displayName}
            </span>

            <span
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) {
                  onDelete(conv._id);
                } else {
                  handleDelete(conv._id);
                }
              }}
              style={{
                cursor: 'pointer',
                color: 'gray',
                marginLeft: 10
              }}
              title="Supprimer"
            >
              🗑️
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;