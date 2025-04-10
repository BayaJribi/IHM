const express = require("express");
const router = express.Router();
const decodeToken = require("../middlewares/auth/decodeToken");

const {
  getModeratorNotifications,
  getPostForModeration,
  acceptPostFromNotification,
  rejectPostFromNotification,
  markNotificationAsRead, // ✅ AJOUT ICI

} = require("../controllers/notification.controller");

// ✅ Ajouter decodeToken pour avoir access à req.userId
router.get("/", decodeToken, getModeratorNotifications);
router.get("/moderate/:id", decodeToken, getPostForModeration);
router.patch("/accept/:id", decodeToken, acceptPostFromNotification);
router.delete("/reject/:id", decodeToken, rejectPostFromNotification);
///
router.patch("/mark-read/:id", decodeToken, markNotificationAsRead);


module.exports = router;
