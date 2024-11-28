const MusicParser = require("../utils/musicParser");
const db = require("../config/db");
const { post } = db.models;
const { Op } = require('sequelize');

exports.createPost = async (req, res) => {
    try {
        const { title, post_content, music_url, username } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const userIdNum = parseInt(username.split('User')[1]);

        let user = await db.models.user.findOrCreate({
            where: { user_id: userIdNum },
            defaults: {
                user_name: username
            }
        });

        const parsedMusic = MusicParser.parseUrl(music_url);

        if (!parsedMusic.is_valid) {
            return res.status(400).json({
                success: false,
                message: `${parsedMusic.error}. Please use a valid Youtube link.`
            });
        }

        const newPost = await post.create({
            user_id: userIdNum,
            title,
            post_content,
            music_url,
            music_platform: parsedMusic.platform,
            embed_url: parsedMusic.url,
            views: 0
        });

        return res.status(201).json({
            success: true,
            message: 'Story shared successfully!',
            post: newPost
        });
    } catch (error) {
        console.error('Post creation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create post. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.filterPostsByDate = async (req, res) => {
    try {
        const date = req.query.date;

        if (!date || !Date.parse(date)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        const searchDate = new Date(date);
        const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

        const filteredPosts = await post.findAll({
            where: {
                created_at: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            order: [['created_at', 'DESC']]
        });

        res.render('home', {
            posts: filteredPosts,
            filterDate: date,
            noResults: filteredPosts.length === 0
        });
    } catch (error) {
        console.error('Error filtering posts by date:', error);
        return res.status(500).json({
            success: false,
            message: 'Error filtering posts by date',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// exports.getPost = async (req, res) => {
//     try {
//         const postId = req.params.id;
//         const retrievedPost = await post.findByPk(postId);

//         if (!retrievedPost) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Post not found'
//             });
//         }

//         res.render('post', { retrievedPost });
//     } catch (error) {
//         console.error('Error fetching post:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error loading post',
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

exports.incrementViews = async (req, res) => {
    try {
        const { post_id } = req.params;

        const result = await post.increment('views', {
            by: 1,
            where: { post_id }
        });

        return res.json({ success: true });
    } catch (error) {
        console.error('Error incrementing views:', error);
        return res.status(500).json({ success: false });
    }
};
