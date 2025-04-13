import React, { useEffect, useState } from 'react';
import axios from '../axios'; // ou 'axios' selon ta config

const NewGroupModal = ({ currentUserId, onClose, onGroupCreated }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    axios.get('/api/users')
      .then(res => {
        setUsers(res.data.filter(u => u._id !== currentUserId));
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement utilisateurs :", err);
        setError("Impossible de charger la liste des utilisateurs");
        setIsLoading(false);
      });
  }, [currentUserId]);

  const toggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("Veuillez donner un nom au groupe");
      return;
    }
    
    if (selectedUsers.length === 0) {
      setError("Veuillez sélectionner au moins un membre");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post('/api/conversations', {
        name: groupName,
        members: [currentUserId, ...selectedUsers],
        isGroup: true
      });
      onGroupCreated(res.data);
      onClose();
    } catch (err) {
      console.error("Erreur création groupe :", err);
      setError("Erreur lors de la création du groupe");
      setIsLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // For Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '500px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        {/* Modal Header */}
        <div style={{
          borderBottom: '1px solid #e1e4e8',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '18px',
            fontWeight: '600',
            color: '#333'
          }}>
            Nouveau Groupe
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={e => e.target.style.backgroundColor = '#eee'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px' }}>
          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '10px 15px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Group Name Input */}
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="groupName"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#444'
              }}
            >
              Nom du groupe
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '16px'
              }}>
                👥
              </div>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Donnez un nom à votre groupe"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  borderRadius: '8px',
                  border: '1px solid #ced4da',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#86b7fe';
                  e.target.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ced4da';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Search Input for Members */}
          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="searchMembers"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#444'
              }}
            >
              Membres du groupe ({selectedUsers.length} sélectionnés)
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '16px'
              }}>
                🔍
              </div>
              <input
                id="searchMembers"
                type="text"
                placeholder="Rechercher des utilisateurs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  borderRadius: '8px',
                  border: '1px solid #ced4da',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#86b7fe';
                  e.target.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ced4da';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* User List */}
          <div style={{
            maxHeight: '250px',
            overflowY: 'auto',
            marginBottom: '20px',
            border: '1px solid #ced4da',
            borderRadius: '8px'
          }}>
            {isLoading ? (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#6c757d'
              }}>
                Chargement des utilisateurs...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#6c757d'
              }}>
                {searchTerm ? 'Aucun utilisateur ne correspond à votre recherche' : 'Aucun utilisateur disponible'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div 
                  key={user._id}
                  onClick={() => toggleUser(user._id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #efefef',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: selectedUsers.includes(user._id) ? '#e9f0ff' : 'transparent',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    if (!selectedUsers.includes(user._id)) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!selectedUsers.includes(user._id)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selectedUsers.includes(user._id) ? '#0d6efd' : '#fff',
                    color: selectedUsers.includes(user._id) ? '#fff' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}>
                    {selectedUsers.includes(user._id) ? "✓" : ""}
                  </div>
                  
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
                    marginRight: '12px',
                    fontSize: '16px'
                  }}>
                    {user.name?.charAt(0) || '?'}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>{user.name}</div>
                    {user.email && (
                      <div style={{ 
                        fontSize: '13px',
                        color: '#6c757d'
                      }}>
                        {user.email}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selected Users Summary */}
          {selectedUsers.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {selectedUsers.map(userId => {
                const user = users.find(u => u._id === userId);
                return (
                  <div 
                    key={userId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#e9f0ff',
                      padding: '4px 8px 4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      gap: '8px'
                    }}
                  >
                    {user?.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUser(userId);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px' 
          }}>
            <button 
              onClick={onClose}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #ced4da',
                backgroundColor: 'transparent',
                color: '#6c757d',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#bbb';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = '#ced4da';
              }}
            >
              Annuler
            </button>
            <button 
              onClick={handleCreateGroup}
              disabled={isLoading || selectedUsers.length === 0 || !groupName.trim()}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0d6efd',
                color: '#fff',
                fontWeight: '500',
                cursor: !isLoading && selectedUsers.length > 0 && groupName.trim() ? 'pointer' : 'not-allowed',
                opacity: !isLoading && selectedUsers.length > 0 && groupName.trim() ? 1 : 0.65,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={e => {
                if (!isLoading && selectedUsers.length > 0 && groupName.trim()) {
                  e.target.style.backgroundColor = '#0b5ed7';
                }
              }}
              onMouseLeave={e => {
                if (!isLoading && selectedUsers.length > 0 && groupName.trim()) {
                  e.target.style.backgroundColor = '#0d6efd';
                }
              }}
            >
              {isLoading ? 'Création...' : 'Créer le groupe'}
            </button>
          </div>
        </div>
      </div>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NewGroupModal;