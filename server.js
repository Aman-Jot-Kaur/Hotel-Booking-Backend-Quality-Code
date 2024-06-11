require("dotenv").config();
global.argv = process.argv.slice(2);
global.port = global.argv[0] || process.env.APP_PORT;
if (!global.port) {
  console.log("port is not defined. argv = ", global.argv);
  process.exit(128);
}
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const express_mongo_sanitize = require("express-mongo-sanitize");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(helmet());
app.use(xss());
app.use(express_mongo_sanitize());
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/uploads", express.static("uploads"));
require("./config/db_connection").db_connection();
app.listen(global.port, () => {
  console.log(`Server is listening on port ${global.port}`);
});
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on('user_connect', (user_id) => {
    socket.join('user_' + user_id); 
  });

  socket.on('hotel_connect', (hotel_id) => {
    socket.join('hotel_' + hotel_id); 
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("confirm_booking", async ({ text, hotel_id, user_id }) => {
    const booking = { text, hotel_id, user_id };
    if (user_id) {
      io.to("user_" + user_id).emit("booking_confirmation", { text });
    }
    if (hotel_id) {
      io.to("hotel_" + hotel_id).emit("booking_notification", { text });
    }
   console.log("The message has been sent " + text);
  });
});

app.use("/", require("./routes"));
process.on("uncaughtException", (err) => {
  console.log("uncaught exception", err);
});
module.exports = module.exports = { app, io };
