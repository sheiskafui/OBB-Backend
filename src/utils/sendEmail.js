import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, token, type = 'register') => {
  const link =
    type === 'register'
      ? `${process.env.FRONTEND_URL}/api/auth/verify/${token}`
      : `${process.env.FRONTEND_URL}/api/auth/verify-password-change/${token}`;

  const subject = type === 'register' ? 'Verify your email' : 'Confirm password change';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Onboardbeta - ${type === 'register' ? 'Email Verification' : 'Password Change Confirmation'}</h2>
      <p>Click the button below to ${type === 'register' ? 'verify your email' : 'confirm your password change'}:</p>
      <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        ${type === 'register' ? 'Verify Email' : 'Confirm Password Change'}
      </a>
      <p>Or copy this link: <a href="${link}">${link}</a></p>
      <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Onboardbeta HR" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html
    });
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error('Failed to send verification email');
  }
};

export { sendVerificationEmail };