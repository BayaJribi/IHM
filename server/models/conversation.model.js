const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
    ],
    isGroup: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: '' // utilisé si c'est un groupe
    }
  },
  { timestamps: true } // Ajoute automatiquement createdAt et updatedAt
);

module.exports = mongoose.model('Conversation', conversationSchema);
