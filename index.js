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

// CREATE SERVER
const server = http.createServer(app);

// INIT SOCKET
initSocket(server);

const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
  console.log(`Server is ok on ${PORT}`);
});
