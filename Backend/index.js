const express = require("express");
const dotenv = require("dotenv");
const db = require("./Config/db");
const cors = require("cors");
const Student = require("../Backend/Models/studentModel");
const StudentRoute = require("../Backend/Router/studentRoute");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());



const PORT = process.env.PORT || 5000;

app.use("/api/students", StudentRoute);


app.get("/", (req, res) => {
    res.send("Student Management backend is running");
});

app.listen(PORT, () => {
    db();
    console.log(`Server is running on ${PORT}`);
});