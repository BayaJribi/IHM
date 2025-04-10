import React, { useEffect, useState } from 'react';
import axios from '../axios'; // ou 'axios' selon ta config

const NewGroupModal = ({ currentUserId, onClose, onGroupCreated }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    axios.get('/api/users')
      .then(res => setUsers(res.data.filter(u => u._id !== currentUserId)))
      .catch(err => console.error("Erreur chargement utilisateurs :", err));
  }, [currentUserId]);

  const toggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      alert("Veuillez donner un nom et choisir au moins un membre");
      return;
    }

    try {
      const res = await axios.post('/api/conversations', {
        name: groupName,
        members: [currentUserId, ...selectedUsers],
        isGroup: true
      });
      alert("✅ Groupe créé !");
      onGroupCreated(res.data);
      onClose();
    } catch (err) {
      console.error("Erreur création groupe :", err);
      alert("Erreur lors de la création du groupe");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: '20%', left: '30%', width: '40%',
      backgroundColor: 'white', padding: 20, border: '1px solid #ccc',
      borderRadius: 8, zIndex: 999
    }}>
      <h3>Nouveau Groupe</h3>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Nom du groupe"
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />

      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
        {users.map(user => (
          <div key={user._id}>
            <label>
              <input
                type="checkbox"
                value={user._id}
                checked={selectedUsers.includes(user._id)}
                onChange={() => toggleUser(user._id)}
              />
              {user.name}
            </label>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={handleCreateGroup}>Créer</button>
        <button onClick={onClose}>Annuler</button>
      </div>
    </div>
  );
};

export default NewGroupModal;