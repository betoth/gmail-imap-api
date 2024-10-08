const GetEmailService = require('../interactions/getEmailService');

/**
 * SendEmail is a task that allows an actor to send an email using the email service.
 */
class SendEmail {
  /**
   * Creates an instance of the SendEmail task.
   * @param {string} to - The recipient's email address.
   * @param {string} subject - The subject of the email.
   * @param {string} text - The plain text content of the email.
   * @param {string} html - The HTML content of the email (optional).
   * @returns {Function} A function that accepts an actor and performs the task of sending an email.
   */
  static perform(to, subject, text, html = '') {
    return async (actor) => {
      const emailService = await GetEmailService.perform()(actor); // Using the interaction to get the emailService
      const messageId = await emailService.sendEmail(to, subject, text, html); // Sending the email via the emailService
      return messageId; // Returning the message ID of the sent email
    };
  }
}

module.exports = SendEmail;
