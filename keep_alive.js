const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is Running 🚀");
});

app.listen(3000, () => {
  console.log("Keep Alive Server Active!");
});
