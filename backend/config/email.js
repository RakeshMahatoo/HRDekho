const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (toEmail, resetLink) => {
  const mailOptions = {
    from: `"DekhoHR" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your DekhoHR password",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border: 1px solid #E5E7EB; border-radius: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
          <div style="width: 32px; height: 32px; background: #1A56DB; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 14px;">D</div>
          <span style="font-weight: 700; font-size: 18px; color: #111827;">DekhoHR</span>
        </div>
        <h2 style="font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 12px;">Reset your password</h2>
        <p style="font-size: 15px; color: #6B7280; line-height: 1.7; margin-bottom: 28px;">
          We received a request to reset your DekhoHR password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetLink}" style="display: inline-block; background: #1A56DB; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-bottom: 24px;">
          Reset password →
        </a>
        <p style="font-size: 13px; color: #9CA3AF; margin-bottom: 0;">
          If you didn't request this, ignore this email. Your password won't change.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">
        <p style="font-size: 12px; color: #9CA3AF;">© 2026 DekhoHR. Built for Indian job seekers.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };