const Message = require('../models/message.model');

// ✅ Envoyer un message (conversation 1-1 ou groupe)
exports.sendMessage = async (req, res) => {
  try {
    const { sender, conversationId, content } = req.body;
    const message = new Message({ sender, conversationId, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Obtenir les messages entre deux utilisateurs (ancienne logique 1-1 si tu l’utilises encore)
exports.getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort('timestamp');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Marquer un message comme lu
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, { isRead: true }, { new: true });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Réagir à un message (1 seule réaction par utilisateur)
exports.reactToMessage = async (req, res) => {
  const { userId, emoji } = req.body;
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: 'Message non trouvé' });

    // Supprimer l'ancienne réaction de ce user (si elle existe)
    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);

    // Ajouter la nouvelle réaction
    message.reactions.push({ userId, emoji });

    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};