import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

// POST add comment
router.post('/', async (req, res) => {
  try {
    const { page, postId, name, email, message } = req.body;

    if (!page || !name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newComment = new Comment({ page, postId, name, email, message });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error saving comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET comments by postId (for blog)
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all comments (for admin)
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE comment by id
router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
