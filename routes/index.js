const express = require("express");
const router = express.Router();
const postRoutes = require("./postRoutes");
const userRoutes = require("./userRoutes");
require("dotenv").config();
const db = require('../config/db');
const { post, user } = db.models;
const { Op } = require('sequelize');

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/home", async (req, res) => {
    try {
        const posts = await post.findAll({
            order: [['created_at', 'DESC']]
        });

        // Check if the local storage is empty
        if (req.query.username === null || req.query.timestamp === null) {
            return res.status(500).send("Error: username or timestamp is null");
        }

        // Check if the user exists
        const u = await user.findOne({ where: { user_name: req.query.username, created_at: { [Op.gte]: req.query.timestamp - 60 * 60 * 1000 } } });
        if (!u) {
            return res.redirect("/");
        }

        // Get all users from the posts
        const userids = await posts.map(post => post.user_id);
        const users = await user.findAll({ where: { user_id: userids } });

        res.render('home', {
            username: req.query.username || 'anonymous',
            user: u,
            posts: posts,
            users: users
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.redirect("/");
    }
});

router.use("/post", postRoutes);

router.use("/user", userRoutes);

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