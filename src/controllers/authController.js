import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/sendEmail.js';

const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      start_date,
      department,
      job_title,
      employment_id
    } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

    const user = await User.create({
      full_name,
      email,
      password: hashed,
      start_date,
      department,
      job_title,
      employment_id,
      profile_picture,
      verificationToken
    });

    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({ message: 'User registered. Verification email sent.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.verificationToken = null; // Clear the token after verification
    await user.save();

    res.json({ message: 'Email verified successfully. You can now login.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const verifyPasswordChange = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ where: { passwordChangeToken: token } });
  if (!user) return res.status(400).json({ error: 'Invalid token' });

  user.password = await bcrypt.hash(password, 10);
  user.passwordChangeToken = null;
  await user.save();

  res.json({ message: 'Password changed successfully' });
};

export { register, login, verifyEmail, verifyPasswordChange };