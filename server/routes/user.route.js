const express = require("express");
const router = express.Router();
const passport = require("passport");
const useragent = require("express-useragent");
const requestIp = require("request-ip");

const User = require("../models/user.model");

const {
  addUser,
  signin,
  logout,
  refreshToken,
  getModProfile,
  getUser,
  updateInfo,
} = require("../controllers/user.controller");

const {
  getPublicUsers,
  followUser,
  getPublicUser,
  unfollowUser,
  getFollowingUsers,
} = require("../controllers/profile.controller");

const {
  addUserValidator,
  addUserValidatorHandler,
} = require("../middlewares/users/usersValidator");

const { sendVerificationEmail } = require("../middlewares/users/verifyEmail");
const { sendLoginVerificationEmail } = require("../middlewares/users/verifyLogin");

const avatarUpload = require("../middlewares/users/avatarUpload");
const {
  signUpSignInLimiter,
  followLimiter,
} = require("../middlewares/limiter/limiter");

const decodeToken = require("../middlewares/auth/decodeToken");
const requireAuth = passport.authenticate("jwt", { session: false }, null);

/* --- Routes publiques --- */

// 🔹 Récupérer tous les utilisateurs (id + nom)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "_id name");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Récupérer un utilisateur par ID (id + nom)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "_id name");
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --- Routes protégées --- */
router.get("/public-users/:id", requireAuth, decodeToken, getPublicUser);
router.get("/public-users", requireAuth, decodeToken, getPublicUsers);
router.get("/moderator", requireAuth, decodeToken, getModProfile);
router.get("/following", requireAuth, decodeToken, getFollowingUsers);
router.get("/profile/:id", requireAuth, decodeToken, getUser); // évite conflit avec "/:id" au-dessus
router.get("/:id", requireAuth, getUser);

router.post(
  "/signup",
  signUpSignInLimiter,
  avatarUpload,
  addUserValidator,
  addUserValidatorHandler,
  addUser,
  sendVerificationEmail
);

router.post("/refresh-token", refreshToken);

router.post(
  "/signin",
  signUpSignInLimiter,
  requestIp.mw(),
  useragent.express(),
  signin,
  sendLoginVerificationEmail
);

router.post("/logout", logout);

router.put("/:id", requireAuth, decodeToken, updateInfo);

router.use(followLimiter);
router.patch("/:id/follow", requireAuth, decodeToken, followUser);
router.patch("/:id/unfollow", requireAuth, decodeToken, unfollowUser);

module.exports = router;
