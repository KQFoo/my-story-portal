const express = require("express");
const router = express.Router();
const postRoutes = require("./postRoutes");
const userRoutes = require("./userRoutes");
require("dotenv").config();
const db = require('../config/db');
const { post, user } = db.models;

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/home", async (req, res) => {
    try {
        const posts = await post.findAll({
            order: [['created_at', 'DESC']]
        });

        const username = await user.findOne({ where: { user_name: req.query.username } });
        if (!username) {
            return res.redirect("/");
        }

        res.render('home', {
            username: req.query.username || 'anonymous',
            posts: posts
        });
    } catch (error) {
        // console.error('Error fetching posts:', error);
        req.flash("error", "Error loading posts");
        res.redirect("/");
    }
});

// router.get("/create-post", (req, res) => {
//     res.render("create-post");
// });

router.use("/post", postRoutes);

router.use("/api/users", userRoutes);

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