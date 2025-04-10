const express = require("express");
const router = express.Router();
const { getNotifications } = require("../controllers/moderator.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/notifications", verifyToken, getNotifications);

module.exports = router;
