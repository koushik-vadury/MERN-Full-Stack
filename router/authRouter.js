const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/userSchema");

router.get("/", (req, res) => {
  res.send("this is home page");
});

router.get("/about", (req, res) => {
  res.send("this is about page");
});

router.get("/database", (req, res) => {
  const data = User.find();
  res.send(data);
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please Fill Email And password" });
  }
  try {
    const userExits = await User.findOne({ email: email });

    const token = await userExits.getJwtToken();
    
    console.log(token);

    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 50000),
    });

    if (userExits) {
      const isMatch = await bcrypt.compare(password, userExits.password);
      if (isMatch) {
        res.status(201).json({ message: "User Login Successfully" });
      }
    } else {
      res.status(422).json({ error: "Email And Password Are Not Matched" });
    }
  } catch (err) {
    console.log(err);
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
      } else {
        res.status(500).json({ error: "User Registration Failed" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
