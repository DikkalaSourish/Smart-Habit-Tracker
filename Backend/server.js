// =====================================================================
//      THE FINAL, CLEANED-UP server.js (for Demo Mode)
// =====================================================================

// 1. IMPORT PACKAGES
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// 2. SETUP THE APP
const app = express();
app.use(cors());
app.use(express.json());

// 3. CONNECT TO DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// 4. DEFINE DATA MODELS
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  streak: { type: Number, default: 0 },
  lastCompleted: { type: Date },
  badge: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});
const Habit = mongoose.model('Habit', HabitSchema);

// 5. HELPER FUNCTION & MIDDLEWARE
function getBadgeForStreakBackend(streak) {
    if (streak >= 30) return '💎';
    if (streak >= 14) return '🥇';
    if (streak >= 7) return '🥈';
    if (streak >= 3) return '🥉';
    return '';
}

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// 6. API ENDPOINTS

// --- USER ROUTES ---
app.post('/api/users/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) { return res.status(400).json({ msg: 'User already exists' }); }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send('User Registered Successfully');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ msg: 'Invalid Credentials' }); }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ msg: 'Invalid Credentials' }); }
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.get('/api/users/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) { return res.status(404).json({ msg: 'User not found' }); }
        const habits = await Habit.find({ user: req.user.id });
        const badgeCounts = {};
        habits.forEach(habit => {
            if (habit.badge && habit.badge !== '') {
                badgeCounts[habit.badge] = (badgeCounts[habit.badge] || 0) + 1;
            }
        });
        res.json({ email: user.email, badgeCounts: badgeCounts });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- HABIT ROUTES ---
app.get('/api/habits', auth, async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(habits);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/api/habits', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const newHabit = new Habit({ name, user: req.user.id });
        const habit = await newHabit.save();
        res.json(habit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.put('/api/habits/:id', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const habit = await Habit.findById(req.params.id);
        if (!habit || habit.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        habit.name = name;
        await habit.save();
        res.json(habit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.delete('/api/habits/:id', auth, async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit || habit.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        await habit.deleteOne();
        res.json({ msg: 'Habit removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// THIS IS THE SPECIAL "DEMO-FRIENDLY" ROUTE
app.post('/api/habits/:id/complete', auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Habit not found' });
    }
    habit.streak = (habit.streak || 0) + 1;
    habit.badge = getBadgeForStreakBackend(habit.streak);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    habit.lastCompleted = today;
    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 7. START THE SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));