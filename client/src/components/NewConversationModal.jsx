import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewConversationModal = ({ currentUserId, onClose, onConversationCreated }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    axios.get('/api/users') // ✅ ici l'URL correcte
      .then(res => {
        const filtered = res.data.filter(user => user._id !== currentUserId);
        setUsers(filtered);
      })
      .catch(err => console.error("❌ Erreur chargement utilisateurs :", err));
  }, [currentUserId]);

  const handleCreate = async () => {
    if (!selectedUserId) return alert("Veuillez choisir un utilisateur");

    try {
      const res = await axios.post('/api/conversations', {
        members: [currentUserId, selectedUserId],
      });

      onConversationCreated(res.data);
      onClose();
    } catch (err) {
      console.error("Erreur création conversation :", err);
      alert("Erreur lors de la création");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: '20%', left: '30%',
      width: '40%', backgroundColor: 'white', padding: 20,
      border: '1px solid #ccc', borderRadius: 8, zIndex: 999
    }}>
      <h3>Nouvelle conversation</h3>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      >
        <option value="">-- Sélectionner un utilisateur --</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={handleCreate}>Créer</button>
        <button onClick={onClose}>Annuler</button>
      </div>
    </div>
  );
};

export default NewConversationModal;