import asyncHandler from "express-async-handler";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

// -----------------------Get All Messages of users-----------------------------

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// --------------------------Send Message to users------------------------------

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name avatar")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name avatar email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// --------------------------Delete Message------------------------------

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  // Check if the requester is the sender
  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can only delete your own messages");
  }

  await Message.findByIdAndDelete(messageId);
  res.json({ message: "Message removed" });
});

// ----------------------Delete Multiple Messages------------------------------

const deleteMultipleMessages = asyncHandler(async (req, res) => {
    // Expecting an array of IDs in body: { messages: ["id1", "id2"] }
    const { messages } = req.body; 

    if(!messages || messages.length === 0) {
        res.status(400);
        throw new Error("No messages selected");
    }

    // Delete only messages where sender is the logged-in user AND id is in the list
    await Message.deleteMany({
        _id: { $in: messages },
        sender: req.user._id
    });

    res.json({ message: "Messages deleted successfully" });
});

export { allMessages, sendMessage, deleteMessage, deleteMultipleMessages };