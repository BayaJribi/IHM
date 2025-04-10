const Notification = require("../models/notification.model");
const Post = require("../models/post.model");

/// ✅ Récupérer toutes les notifications d’un modérateur
const getModeratorNotifications = async (req, res) => {
  const userId = req.userId;

  try {
    const notifications = await Notification.find({
      recipient: userId,
      isRead: false,
    })
      .populate("post", "content status")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Erreur getModeratorNotifications:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/// ✅ Voir les détails d’un post à modérer
/// ✅ Voir les détails d’un post à modérer
/// ✅ Voir les détails d’un post à modérer et marquer comme lue
const getPostForModeration = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    // 🔥 Marquer la notification comme lue
    await Notification.updateOne(
      { post: postId, recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    const post = await Post.findById(postId)
      .populate("user", "name avatar")
      .populate("community", "name");

    if (!post) {
      return res.status(404).json({ message: "Post introuvable" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Erreur getPostForModeration:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



/// ✅ Accepter un post depuis une notification
const acceptPostFromNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndUpdate(id, { status: "approved" });
    res.status(200).json({ message: "✅ Post approuvé avec succès" });
  } catch (error) {
    console.error("Erreur acceptPostFromNotification:", error);
    res.status(500).json({ message: "Erreur lors de l'approbation du post" });
  }
};

/// ✅ Refuser un post depuis une notification
const rejectPostFromNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "❌ Post supprimé avec succès" });
  } catch (error) {
    console.error("Erreur rejectPostFromNotification:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du post" });
  }
};
////ajouter 
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.status(200).json({ message: "Notification marquée comme lue" });
  } catch (err) {
    console.error("Erreur markNotificationAsRead:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


/// ✅ Exporter toutes les fonctions
module.exports = {
    getModeratorNotifications,
    getPostForModeration,
    acceptPostFromNotification,
    rejectPostFromNotification,
    markNotificationAsRead,

  };
  
