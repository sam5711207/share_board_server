const express = require("express");
const cors = require("cors");
const app = express();

const server = app.listen(3001, () => {
  console.log("connect");
});

app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let arrPointsDraw = [];
let arrNames = [];

io.on("connection", (socket) => {
  socket.on("getDraw", () => {
    socket.emit("drawingListener", arrPointsDraw);
  });

  io.on("connect", function (socket) {
    socket.on("sendDraw", (shardDraw) => {
      socket.broadcast.emit("drawingListener", shardDraw);
    });
  });

  socket.on("sendDraw", (lines) => {
    arrPointsDraw = lines;
    io.emit("drawingListener", lines);
  });
  socket.on("addMember", (name) => {
    arrNames.push({ name: name, isDisable: false });
    io.emit("newMember", arrNames);
  });
});
