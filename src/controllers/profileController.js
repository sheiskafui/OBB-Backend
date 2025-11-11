import User from '../models/user.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/sendEmail.js';


const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

  const token = crypto.randomBytes(32).toString('hex');
  user.passwordChangeToken = token;
  await user.save();

  await sendVerificationEmail(user.email, token, 'password-change');
  res.json({ message: 'Verification email sent. Click the link to confirm password change.' });
};

const getProfile = async (req, res) => {
  try {
   const user = await User.findOne({ where: { user_id: req.user.id } }, {
      attributes: ['user_id', 'full_name', 'email', 'start_date', 'department', 'job_title', 'employment_id', 'profile_picture']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { full_name, email } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.full_name = full_name || user.full_name;
    user.email = email || user.email;
    await user.save();

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export { getProfile, updateProfile, changePassword };