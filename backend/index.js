import express from "express"
import { Server } from "socket.io";
import { configDotenv } from "dotenv";
import cors from "cors"
import connectMongoDB from "./database/mongodb.js"
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js"
import { errorHandler, notFound } from "./middleware/error.middleware.js";
configDotenv();
connectMongoDB()
const app = express();
app.use(cors());
app.use(express.json())

// --------------------------Routes------------------------------

app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)
app.use("/api/message", messageRouter)
app.get("/", (req, res) => {
  res.send("hello chat-app")
})
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date() });
});
// --------------------------Middlewares------------------------------

app.use(errorHandler)
app.use(notFound)


// --------------------------Server------------------------------

const PORT =process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// --------------------------SocketIO------------------------------

const io = new Server(server, {
  pingTimeout: 50000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});
io.on("connection", (socket) => {
  console.log("New Socket connected")
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");

  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new group", (newChat) => {
     if(!newChat || !newChat.users) return;

     newChat.users.forEach(user => {
        if(user._id === newChat.groupAdmin._id) return;
        socket.in(user._id).emit("added to group", newChat);
     });
  });
  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;

    if (!chat || !chat.users)
      return console.log("chat or chat.users not defined");

    for (const user of chat.users) {
      if (user._id === newMessageRecieved.sender._id) continue;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    }
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
})