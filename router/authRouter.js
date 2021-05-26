const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  res.send("this is home page");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please Fill Email And password" });
  }
  try {
    const userExits = await User.findOne({ email: email });

    if (userExits) {
      const isMatch = await bcrypt.compare(password, userExits.password);
      if (isMatch) {
        let token = await userExits.getJwtToken();
        res.cookie("jwt_token", token, {
          expires: new Date(Date.now() + 2456765),
          httpOnly: true,
          // sameSite: true,
        });
        res.status(201).json({ message: "User Login Successfully" });
      }
    } else {
      res.status(422).json({ error: "Email And Password Are Not Matched" });
    }
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: "Email And Password Are Not Matched" });
  }
});

router.post("/registration", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res
      .status(422)
      .json({ error: "Please Fill All The Fields Carefully" });
  }

  try {
    const userExits = await User.findOne({ email: email });
    if (userExits) {
      return res.status(422).json({ error: "Email Alrady Token" });
    } else if (password !== cpassword) {
      return res
        .status(422)
        .json({ error: "Password And Confirm Password Are Not Match" });
    } else {
      const user = new User({
        name,
        email,
        phone,
        work,
        password,
        cpassword,
      });

      const data = await user.save();
      if (data) {
        res.status(201).json({ message: "User Registration Successfully" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", auth, (req, res) => {
  res.send(req.isMatch);
});

router.post("/contact", auth, async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.json({ error: "Please Fill The Field " });
  }
  try {
    const userContact = await User.findOne({ _id: req._id });
    if (userContact) {
      const userMessage = userContact.addMessage(name, email, phone, message);
      // await userMessage.save();
      res.status(200).json({ message: "Message Sent Successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", async (req, res) => {
  await res.clearCookie("jwt_token");
  await res.status(200).send("logout Successfully");
});

module.exports = router;
