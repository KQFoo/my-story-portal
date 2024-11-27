const express = require("express");
const router = express.Router();
const postRoutes = require("./postRoutes");
require("dotenv").config();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/home", (req, res) => {
    res.render("home");
});

router.get("/create-post", (req, res) => {
    res.render("create-post");
});

router.use("/post", postRoutes);

router.get("/api/quote", async (req, res) => {
    try {
        const response = await fetch(process.env.API_URL_2);
        const data = await response.json();

        if (data === null) {
            console.error('No data received from the API');
            return res.status(404).json({ error: 'No data received from the API' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Failed to fetch quote: ${error}` });
    }
});

module.exports = router;