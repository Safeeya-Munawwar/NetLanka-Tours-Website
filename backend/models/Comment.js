import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  page: { type: String, enum: ['home', 'contact', 'blog'], required: true }, // page source
  postId: { type: String }, // only for blog posts
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email']  // validate email
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
