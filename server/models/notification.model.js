const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ correct
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  community: { type: Schema.Types.ObjectId, ref: 'Community', required: true },
  message: { type: String, default: 'Nouveau post en attente' },
  type: { type: String, default: 'pending_post' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);
