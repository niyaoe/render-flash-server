const express = require("express");
const connection = require("./MogoDB/Config")
const dotenv = require("dotenv");
const app = express();
const cors = require("cors")

dotenv.config();

connection();

app.use(cors({
    origin:"http://localhost:5173"
}))

app.use(express.json());

/* routes */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));


const PORT = process.env.PORT || 5002
app.listen(PORT,()=>{console.log(`server is ok on ${PORT}`);
})