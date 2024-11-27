const express = require("express");
const app = express();
const mainRouter = require("./routes/index");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/db");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", mainRouter);

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
    if (err) {
        console.err("Error in running the server");
    }
    console.log(`Server is running on http://localhost:${PORT}`);
})