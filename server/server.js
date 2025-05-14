// Book Blog API Server
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize dotenv
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB connection string is not defined in environment variables');
    }
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Define schemas
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  coverImageURL: {
    type: String,
    default: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);

// Authentication middleware
const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied, no token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  // Check token
  try {
    // In a production app, you'd use an environment variable for the JWT secret
    const jwtSecret = process.env.JWT_SECRET || 'bookblog-secret-key';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Save user to database
    await user.save();
    
    // Generate token
    const jwtSecret = process.env.JWT_SECRET || 'bookblog-secret-key';
    const payload = {
      user: {
        id: user.id,
        name: user.name
      }
    };
    
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            _id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    
    // Generate token
    const jwtSecret = process.env.JWT_SECRET || 'bookblog-secret-key';
    const payload = {
      user: {
        id: user.id,
        name: user.name
      }
    };
    
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            _id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Post routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ post });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/posts', auth, async (req, res) => {
  try {
    const { title, author, content, coverImageURL } = req.body;
    
    const newPost = new Post({
      title,
      author,
      content,
      coverImageURL: coverImageURL || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'
    });
    
    const post = await newPost.save();
    res.json({ post });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/posts/:id', auth, async (req, res) => {
  try {
    const { title, author, content, coverImageURL } = req.body;
    
    // Find post
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Update post
    post.title = title || post.title;
    post.author = author || post.author;
    post.content = content || post.content;
    post.coverImageURL = coverImageURL || post.coverImageURL;
    
    await post.save();
    res.json({ post });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Comment routes
// Add a comment to a post
app.post('/api/posts/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const newComment = {
      userId: req.user.id,
      userName: req.user.name,
      content
    };
    
    post.comments.unshift(newComment);
    await post.save();
    
    res.json({ comments: post.comments });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment
app.delete('/api/posts/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Find the comment
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is authorized to delete the comment
    if (comment.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this comment' });
    }
    
    // Remove the comment
    const removeIndex = post.comments
      .map(comment => comment._id.toString())
      .indexOf(req.params.commentId);
    
    post.comments.splice(removeIndex, 1);
    await post.save();
    
    res.json({ comments: post.comments });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
