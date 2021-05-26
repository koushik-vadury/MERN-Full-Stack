const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;

    const isVerify = jwt.verify(token, process.env.SCQURE_KEY);

    const isMatch = await User.findOne({
      _id: isVerify._id,
      "tokens.token": token,
    });
    if (!isMatch) {
      throw new error("Invalid token");
    }
    req.token = token;
    // req.isVerify = isVerify;
    // req.userId = isVerify._id;
    req.isMatch = isMatch;
    req._id = isMatch._id;
    next();
  } catch (err) {
    res.status(401).send("Unothorised : Token Is Not Provided");
    // console.log(err);
  }
};

module.exports = auth;
