const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.MONGODB_URI;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

const User = require("./models/user.model");
const Note = require("./models/note.model");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { authenticate } = require("./utilities");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res.status(400).json({ error: true, message: "Full name required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email required" });
  }

  if (!password) {
    return res.status(400).json({ error: true, message: "Password required" });
  }
  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.json({ error: true, message: "User already exists" });
  }
  const user = new User({
    fullName,
    email,
    password,
  });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration successful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: true, message: "Email required" });
  }
  if (!password) {
    return res.status(400).json({ error: true, message: "Password required" });
  }
  const userInfo = await User.findOne({ email: email });
  if (!userInfo) {
    return res.status(400).json({ error: true, message: "User not found" });
  }
  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3000m",
    });
    return res.json({
      error: false,
      message: "Login successful",
      email,
      accessToken,
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Invalid credentials" });
  }
});

app.get("/get-user", authenticate, async (req, res) => {
  const { user } = req.user;
  console.log(user);
  const isUser = await User.findOne({ _id: user.user._id });
  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

app.post("/add-note", authenticate, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;
  if (!title) {
    return res.status(400).json({ error: true, message: "Title required" });
  }
  if (!content) {
    return res.status(400).json({ error: true, message: "Content required" });
  }
  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user.user._id,
    });
    await note.save();
    return res.json({ error: false, note, message: "Note added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});
app.put("/edit-note/:noteId", authenticate, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;
  if (!title && !content && !tags) {
    return res.status(400).json({ error: true, message: "No changes" });
  }
  try {
    const note = await Note.findOne({ userId: user.user._id, _id: noteId });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }
    if (title) {
      note.title = title;
    }
    if (content) {
      note.content = content;
    }
    if (tags) {
      note.tags = tags;
    }
    if (isPinned) {
      note.isPinned = isPinned;
    }
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});
app.get("/get-notes", authenticate, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user.user._id }).sort({
      isPinned: -1,
    });
    return res.json({ error: false, notes, message: "Notes fetched" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});
app.delete("/delete-note/:noteId", authenticate, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  try {
    const note = await Note.findOne({ userId: user.user._id, _id: noteId });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }
    await note.deleteOne({ userId: user.user._id, _id: noteId });
    return res.json({ error: false, message: "Note deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});
app.put("/update-note-pinned/:noteId", authenticate, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;
  try {
    const note = await Note.findOne({ userId: user.user._id, _id: noteId });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }
    note.isPinned = isPinned;

    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.get("/search", authenticate, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: true, message: "Query required" });
  }
  try {
    const notes = await Note.find({
      userId: user.user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
        { tags: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({ error: false, notes, message: "Notes fetched" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.listen(4000);
module.exports = app;
