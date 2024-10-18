const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const chatRoute = require("./Routes/chatRoute");
const userRoute = require("./Routes/userRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();
require("dotenv").config();

app.use(express.json());

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.CLIENT_URL.split(',');
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true // Allow credentials if you are sending them
};

app.use(cors(corsOptions));
app.use("/api", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
    res.send("welcome to our chat api...");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

const expressServer = app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

mongoose.connect(uri)
    .then(() => console.log("MongoDB connection established"))
    .catch((error) => {
        console.log("MongoDB connection failed", error.message);
        process.exit(1);
    });

const io = new Server(expressServer, { 
    cors: corsOptions // Use the same corsOptions here
});

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    socket.on("addNewUser", (userId) => {
        if (!onlineUsers.some(user => user.userId === userId)) {
            onlineUsers.push({ userId, socketId: socket.id });
        }
        console.log("onlineUsers", onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);
    });

    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find((user) => user.userId === message.recipientId);

        if (user) {
            io.to(user.socketId).emit("getMessage", message);
            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date(),
            });
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});
