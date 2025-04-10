const Post = require("../models/post.model");
const User = require("../models/user.model");

const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "moderator") {
      return res.status(403).json({ message: "Non autorisé" });
    }

    const pendingPosts = await Post.find({ status: "pending" })
      .populate("user", "name avatar")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(pendingPosts);
  } catch (error) {
    console.error("Erreur dans getNotifications:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { getNotifications };
