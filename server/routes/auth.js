const express = require("express");
const argon2 = require("argon2");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  //simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, massage: "Missing username and/or password" });

  try {
    //check for existing user
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "username already taken" });

    //All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    //return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "create account successfully!",
      accessToken,
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  //simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    //username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    //All good
    // return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({success: true, message: "User logged successfully!",accessToken})
  } catch (err) {
    console.log(err)
    res.status(500).json({success: false, message: "Internal server error"})
  }
});

router.get("/", (req, res) => res.send("USER ROUTE"));

module.exports = router;
