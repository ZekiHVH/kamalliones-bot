const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  return res.send("🚀 Up and running...");
});

app.listen(3000, () => {});
