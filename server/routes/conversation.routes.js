const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation.model');

// Créer une nouvelle conversation
router.post('/', async (req, res) => {
  try {
    const { members } = req.body;
    const conversation = new Conversation({ members });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les conversations d’un utilisateur
router.get('/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] }
    });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete('/:id', async (req, res) => {
    try {
      await Conversation.findByIdAndDelete(req.params.id);
      res.json({ message: "Conversation supprimée ✅" });
    } catch (err) {
      console.error("Erreur suppression :", err);
      res.status(500).json({ error: err.message });
    }
  });


  router.post('/group', async (req, res) => {
    try {
      const { members, name } = req.body;
      if (!members || members.length < 3) {
        return res.status(400).json({ error: "Un groupe doit contenir au moins 3 membres." });
      }
  
      const conversation = new Conversation({
        members,
        isGroup: true,
        name,
      });
  
      await conversation.save();
      res.status(201).json(conversation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports = router;
