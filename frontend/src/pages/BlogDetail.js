import React, { useState, useEffect } from 'react';
import axios from "../axiosConfig";
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";

const BlogDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  // Blog post
  const [post, setPost] = useState(null);

  // Comments
  const [comments, setComments] = useState([]);

  // Form state
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  // Loading & error
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('success'); // 'success' or 'error'

  // Fetch blog post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/blogs/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setPost(null);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  // Fetch comments
  const fetchComments = React.useCallback(async () => {
    if (!postId) return;
    try {
      const res = await axios.get(`/api/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  }, [postId]);
  
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);
  

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle comment submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatusMessage('Please fill all fields');
      setStatusType('error');
      return;
    }

    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      setStatusMessage('Please enter a valid email');
      setStatusType('error');
      return;
    }

    if (!postId) {
      setStatusMessage('Invalid post ID');
      setStatusType('error');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`/api/comments`, {
        page: 'blog',
        postId,
        name,
        email,
        message,
      });

      if (res.status === 201) {
        setForm({ name: '', email: '', message: '' });
        setStatusMessage('Comment posted successfully!');
        setStatusType('success');
        fetchComments();
      } else {
        setStatusMessage('Failed to post comment');
        setStatusType('error');
      }
    } catch (err) {
      console.error('Failed to post comment:', err.response || err.message);
      setStatusMessage('Failed to post comment');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return (
      <div style={styles.notFoundContainer}>
        <h2 style={styles.notFoundTitle}>Blog not found</h2>
        <p>If you're looking for something specific, please call us at:</p>
        <p style={styles.contactNumber}>+94 777 111553</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backButtonContainer}>
        <button onClick={() => navigate('/blog')} style={styles.backButton}>
          <FaArrowLeft style={{ marginRight: 6 }} /> Back to Blog
        </button>
      </div>

      <h1 style={styles.title}>{post.title}</h1>

      {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={styles.postImage} />}
      <p style={styles.content}>{post.content}</p>

      <h2 style={styles.commentsHeading}>Comments</h2>

      <form onSubmit={handleSubmit} style={styles.commentForm}>
        <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required style={styles.input} />
        <input type="email" name="email" placeholder="Your email" value={form.email} onChange={handleChange} required style={styles.input} />
        <textarea name="message" placeholder="Your comment" value={form.message} onChange={handleChange} required rows={5} style={styles.textarea} />
        <button type="submit" disabled={loading} style={{ ...styles.submitButton, cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: loading ? '#4b6b4a' : '#064420' }}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
        {statusMessage && <p style={{ color: statusType === 'success' ? '#1b5e20' : '#d32f2f', fontWeight: '600', marginTop: 8 }}>{statusMessage}</p>}
      </form>

      <div>
        {comments.length === 0 ? (
          <p style={styles.noComments}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} style={styles.commentCard}>
              <p style={styles.commentName}>
                <FaUserCircle style={{ verticalAlign: "middle", marginRight: 6, color: "#064420" }} />
                {c.name}{' '}
                <span style={styles.commentDate}>({new Date(c.createdAt).toLocaleString()})</span>
              </p>
              <p style={styles.commentMessage}>{c.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: 800, margin: '20px auto', padding: '0 15px', fontFamily: "'Times New Roman', Times, serif" },
  backButtonContainer: { marginBottom: 20 },
  backButton: { background: 'transparent', border: 'none', color: '#064420', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', fontFamily: "'Times New Roman', Times, serif" },
  title: { fontSize: '2.2rem', marginBottom: 20, color: '#064420', fontFamily: "'Times New Roman', Times, serif", textAlign: 'center', userSelect: 'none' },
  postImage: { width: '100%', borderRadius: 12, marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', objectFit: 'cover' },
  content: { fontSize: '1rem', lineHeight: 1.6, marginBottom: 30, color: '#333', whiteSpace: 'pre-wrap' },
  commentsHeading: { marginBottom: 16, color: '#064420', fontWeight: '600' },
  commentForm: { marginBottom: 40, padding: 15, borderRadius: 10, background: '#f5f7f6', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 10 },
  input: { width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16, resize: 'vertical', boxSizing: 'border-box' },
  submitButton: { padding: '10px 20px', fontSize: 16, backgroundColor: '#064420', color: '#fff', border: 'none', borderRadius: 6, transition: 'background 0.3s ease' },
  noComments: { fontStyle: 'italic', color: '#555' },
  commentCard: { borderBottom: '1px solid #ccc', paddingBottom: 10, marginBottom: 15 },
  commentName: { margin: 0, fontWeight: 'bold', fontSize: 14 },
  commentDate: { fontWeight: 'normal', color: '#555', fontSize: 12 },
  commentMessage: { marginTop: 6, whiteSpace: 'pre-wrap', fontSize: 14 },
  notFoundContainer: {
    padding: 40,
    textAlign: 'center',
    fontFamily: "'Times New Roman', Times, serif",
  },
  notFoundTitle: {
    color: 'crimson',
    marginBottom: 10,
  },
  contactNumber: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
};

export default BlogDetail;
