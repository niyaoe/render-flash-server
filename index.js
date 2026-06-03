const express = require("express");
const http = require("http");
const connection = require("./MogoDB/Config");
const dotenv = require("dotenv");
const cors = require("cors");

const initSocket = require("./socket/socket"); // import

dotenv.config();
connection();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.use(express.json());

/* routes */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/rooms", require("./routes/room.routes"));
app.use("/api/posts", require("./routes/post.routes"));

app.use((err, req, res, next) => {
  console.log(err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      msg: "File too large. Max 50MB",
    });
  }

  res.status(500).json({
    msg: err.message,
  });
});

// CREATE SERVER
const server = http.createServer(app);

// INIT SOCKET
initSocket(server);

const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
  console.log(`Server is ok on ${PORT}`);
});
