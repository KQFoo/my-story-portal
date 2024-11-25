const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/api/quote", async (req, res) => {
    try {
        const response = await fetch(process.env.API_URL_2);
        const data = await response.json();

        if (!data) {
            return res.status(404).json({ error: `Failed to fetch quote: ${data.error}` });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Failed to fetch quote: ${error}` });
    }
});

module.exports = router;