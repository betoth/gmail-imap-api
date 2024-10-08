const nodemailer = require('nodemailer');
const { user } = require('../../screenplay/config/constants');

class EmailSender {
  constructor(email, password) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });
  }

  async sendEmail(to, subject, text, html = '') {
    const mailOptions = {
      from: this.transporter.options.auth.user,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info.messageId; // Retorna o ID da mensagem enviada
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EmailSender;
