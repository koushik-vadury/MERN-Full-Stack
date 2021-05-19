const express = require("express");
const app = express();
const dotenv = require("dotenv");
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
dotenv.config({ path: "./config.env" });

app.use(require("./router/authRouter"));

const User = require("./models/userSchema");

//mongodb start

require("./db/conn");

//mongodb end

//port no start

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Connected With Port No ${port}`);
});

//port no end
