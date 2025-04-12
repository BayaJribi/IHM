const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

// ➕ Envoyer un message
router.post('/send', messageController.sendMessage);

// 📩 Récupérer les messages d’une conversation
router.get('/by-conversation/:conversationId', messageController.getMessages);

// ✅ Réagir à un message
router.post('/react/:messageId', messageController.reactToMessage);

// ✅ Marquer comme lu
router.put('/messages/:id/read', messageController.markMessageAsRead);

// ❌ Supprimer un message
router.delete('/messages/:id', messageController.deleteMessage);

// ❌ Supprimer une réaction
router.delete('/react/:messageId/:userId', messageController.removeReaction);

module.exports = router;
