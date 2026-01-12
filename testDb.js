const path = require("node:path");

const express = require("express");
const app = express();

const {createMessage, getMessage, getMessages}  = require("./database/db.js");


app.get("/", async (req, res) => {
  const message = await getMessages();
  // const message = 'message loaded'
  res.send(message);
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});