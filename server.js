const express = require("express");
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`MOCK EXPRESS SERVER RUNNING ON PORT ${process.env.PORT}`);
});
