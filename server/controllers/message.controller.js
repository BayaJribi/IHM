const Message = require('../models/message.model');

// ✅ Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { sender, content, conversationId } = req.body;
    if (!content || !conversationId || !sender) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    const message = new Message({ sender, content, conversationId });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Obtenir les messages d’une conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .sort('timestamp')
      .populate('sender', 'name');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Réagir à un message
exports.reactToMessage = async (req, res) => {
  const { userId, emoji } = req.body;

  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: "Message non trouvé" });

    // Supprimer l'ancienne réaction si elle existe
    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);

    // Ajouter la nouvelle réaction
    message.reactions.push({ userId, emoji });

    await message.save();

    // Re-populate le sender (pour afficher les noms côté front)
    const populated = await message.populate('sender', 'name');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Marquer un message comme lu
// ✅ Marquer un message comme lu
exports.markMessageAsRead = async (req, res) => {
  try {
    // Utiliser findByIdAndUpdate pour marquer le message comme "lu" et retourner la version mise à jour
    const message = await Message.findByIdAndUpdate(
      req.params.id, 
      { isRead: true },  // Mettre à jour isRead à true
      { new: true }  // Retourner le message mis à jour
    );
    
    // Si aucun message n'a été trouvé
    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    // Retourner le message mis à jour avec le champ isRead = true
    res.status(200).json(message);  
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// ✅ Supprimer une réaction
exports.removeReaction = async (req, res) => {
  try {
    const { messageId, userId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message non trouvé" });

    // Supprimer la réaction
    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);
    await message.save();

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    res.status(200).json({ message: 'Message supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
