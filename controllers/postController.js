const MusicParser = require("../utils/musicParser");
const db = require("../config/db");
const { post } = db.models;

exports.createPost = async (req, res) => {
    try {
        // console.log('Request body:', req.body);
        const { title, post_content, music_url } = req.body;
        // console.log('Music URL:', music_url);

        const parsedMusic = MusicParser.parseUrl(music_url);

        if (!parsedMusic.is_valid) {
            return res.status(400).json({ error: `${parsedMusic.error}. Please use a valid Youtube link.` });
        }

        const newPost = await post.create({
            user_id: 1,
            title,
            post_content,
            music_url,
            music_platform: parsedMusic.platform,
            embed_url: parsedMusic.url,
        });

        res.status(201).json({ message: "Post created successfully", newPost });
    } catch (error) {
        res.status(500).json({ error: "Failed to create post", error: error.message });
    }
};

exports.getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const retrievedPost = await post.findByPk(postId);

        if (!retrievedPost) {
            return res.status(404).send('Post not found');
        }

        res.render('post', { retrievedPost });
    } catch (error) {
        // console.error('Error fetching post:', error);
        res.status(500).send('Error loading post');
    }
};
