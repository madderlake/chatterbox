const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const app = express();

app.use(cors());

const server = app.listen(8083, function() {
  console.log("server is running on port 8083");

  const io = socket(server);

  io.on("connection", socket => {
    console.log(socket.id + " connected");

    socket.on("SEND_MESSAGE", function(data) {
      io.emit("RECEIVE_MESSAGE", data);
    });
  });
});
