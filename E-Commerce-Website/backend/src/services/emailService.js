'use strict';
/**
 * Email Service
 * 
 * Architecture:
 *   EmailService → ConsoleEmailProvider (dev)
 *   EmailService → SMTPProvider (prod, configure EMAIL_HOST)
 */

const config = require('../config/env');

class ConsoleEmailProvider {
  async send({ to, subject, body }) {
    console.log(`\n📧 [DEV EMAIL] To: ${to} | Subject: ${subject}\n${body}\n`);
    return { success: true, provider: 'CONSOLE' };
  }
}

class SMTPProvider {
  constructor() {
    const nodemailer = require('nodemailer');
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: { user: config.email.user, pass: config.email.pass },
    });
  }

  async send({ to, subject, body }) {
    const info = await this.transporter.sendMail({
      from: `CodeAlpha Store <${config.email.from}>`,
      to,
      subject,
      html: body,
    });
    return { success: true, messageId: info.messageId, provider: 'SMTP' };
  }
}

const getProvider = () => {
  if (config.email.mode === 'smtp') return new SMTPProvider();
  return new ConsoleEmailProvider();
};

const sendOrderConfirmation = async (user, order) => {
  const provider = getProvider();
  await provider.send({
    to: user.email,
    subject: `Order Confirmed #${order.id.slice(0, 8).toUpperCase()}`,
    body: `<h2>Thank you for your order!</h2><p>Your order <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> has been confirmed.</p><p>Total: ₹${order.total_amount}</p>`,
  });
};
const sendWelcomeEmail = async (user) => {
  const provider = getProvider();
  await provider.send({
    to: user.email,
    subject: 'Welcome to CodeAlpha Store!',
    body: `<h2>Welcome, ${user.name}!</h2><p>Thank you for joining CodeAlpha Store. Start shopping today!</p>`,
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const provider = getProvider();
  const resetLink = `${config.cors.origin}/reset-password?token=${resetToken}`;
  await provider.send({
    to: user.email,
    subject: 'Password Reset Request',
    body: `<h2>Password Reset</h2><p>Hello ${user.name},</p><p>You requested a password reset. Click the link below to set a new password:</p><p><a href="${resetLink}">Reset Password</a></p><p>This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>`,
  });
};

const sendVerificationEmail = async (user, verifyToken) => {
  const provider = getProvider();
  const verifyLink = `${config.cors.origin}/verify-email?token=${verifyToken}`;
  await provider.send({
    to: user.email,
    subject: 'Verify Your Email Address',
    body: `<h2>Verify Email</h2><p>Hello ${user.name},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyLink}">Verify Email</a></p>`,
  });
};

module.exports = { sendOrderConfirmation, sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail };
