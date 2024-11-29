const db = require("../config/db");
const { user } = db.models;

exports.createUser = async (req, res) => {
    try {
        const { username } = req.body;

        let existingUser = await user.findOne({ where: { user_name: username } });

        if (existingUser) {
            return res.json({
                success: true,
                user: existingUser,
                message: 'User already exists'
            });
        }

        const newUser = await user.create({ user_name: username });

        res.json({
            success: true,
            user: newUser,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user'
        });
    }
};
