// controllers/conversation.controller.js

const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');

// Créer une conversation (privée ou groupe)
exports.createConversation = async (req, res) => {
  try {
    const { members, name, isGroup } = req.body;

    if (!Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ error: 'Une conversation doit avoir au moins 2 membres.' });
    }

    const conversation = new Conversation({
      members,
      name: isGroup ? name : null,
      isGroup: !!isGroup,
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer toutes les conversations d’un utilisateur
exports.getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    }).sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Conversation.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ error: 'Conversation non trouvée' });

    res.status(200).json({ message: 'Conversation supprimée.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
