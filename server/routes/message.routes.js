const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');
const messageController = require('../controllers/message.controller');


// ➕ Envoyer un message
router.post('/send', async (req, res) => {
  const { sender, content, conversationId } = req.body;
  try {
    const message = new Message({ sender, content, conversationId });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📩 Récupérer les messages d’une conversation
router.get('/by-conversation/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Réagir à un message (remplace la réaction précédente du même utilisateur)
router.post('/react/:messageId', async (req, res) => {
  const { userId, emoji } = req.body;

  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: "Message non trouvé" });
    }

    // Retirer toute ancienne réaction de cet utilisateur
    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);

    // Ajouter la nouvelle
    message.reactions.push({ userId, emoji });

    await message.save();
    res.json(message);
  } catch (err) {
    console.error("❌ Erreur réaction :", err);
    res.status(500).json({ error: err.message });
  }
});

// (Optionnel) Supprimer une réaction d’un message
router.delete('/react/:messageId/:userId', async (req, res) => {
  const { messageId, userId } = req.params;
  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message non trouvé" });

    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);
    await message.save();
    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/react/:messageId', async (req, res) => {
    const { userId, emoji } = req.body;
    try {
      const message = await Message.findById(req.params.messageId);
      
      // Supprimer toute ancienne réaction de ce user
      message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);
      
      // Ajouter la nouvelle
      message.reactions.push({ userId, emoji });
      
      await message.save();
      res.json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.post('/react/:messageId', messageController.reactToMessage);


module.exports = router;
