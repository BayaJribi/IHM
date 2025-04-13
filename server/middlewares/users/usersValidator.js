const { check, validationResult } = require("express-validator");
const User = require("../../models/user.model");
const path = require("path");
const fs = require("fs");

const addUserValidator = [

  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error(
            "There is already an account associated with this email address"
          );
        }
      } catch (err) {
        throw err;
      }
    }),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  check("role").default("general"),
];

const addUserValidatorHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (req.files && req.files.length > 0) {
      const { filename } = req.files[0];
      const filePath = path.join(
        __dirname,
        `../../assets/userAvatars/${filename}`
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
        console.log(`${filePath} was deleted`);
      });
    }
    res
      .status(400)
      .json({ errors: Object.values(mappedErrors).map((error) => error.msg) });
  }
};

module.exports = {
  addUserValidator,
  addUserValidatorHandler,
};
