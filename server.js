const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`MOCK EXPRESS SERVER RUNNING ON PORT ${port}`);
});
