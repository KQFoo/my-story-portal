const express = require("express");
const app = express();
const mainRouter = require("./routes/index");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/db");
const session = require('express-session');
const flash = require('connect-flash');
const http = require('http');
const socketIO = require('socket.io');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server);

// Socket.IO connection handling
io.on('connection', (socket) => {
    const index = io.engine.clientsCount;
    console.log(`User${index} connected.`);

    // Update online count for all users
    io.emit('updateOnlineUsers', io.engine.clientsCount);

    socket.on('disconnect', () => {
        console.log(`User${index} disconnected.`);
        io.emit('updateOnlineUsers', io.engine.clientsCount);
    });
});

// Configure CORS with specific options
app.use(cors({
    origin: true,
    credentials: true
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

// Make flash messages available to all views
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Static files and view engine setup
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
app.use("/", mainRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Check if the request expects JSON
    if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

    // For regular requests, render an error page or redirect
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT;
server.listen(PORT, (err) => {
    if (err) {
        console.error("Error in running the server:", err);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});