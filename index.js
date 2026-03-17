const express = require("express");
const connection = require("./MogoDB/Config")
const dotenv = require("dotenv");
const app = express();

dotenv.config();

connection();



const PORT = process.env.PORT
app.listen(PORT,()=>{console.log(`server is ok on ${PORT}`);
})