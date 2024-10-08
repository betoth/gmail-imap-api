const EmailParser = require('./parser');
const ImapClient = require('./imapClient');
const SmtpClient = require('./smtpClient');

/**
 * EmailService is responsible for managing email-related operations, including sending, receiving, and deleting emails.
 */
class EmailService {
  /**
   * Creates an instance of EmailService with the specified email and password.
   * @param {string} email - The email address to use for authentication.
   * @param {string} password - The password to use for authentication.
   */
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.emailSender = new SmtpClient(email, password); // Instancia SmtpClient
  }

  /**
   * Fetches all unseen emails from the inbox.
   * @returns {Promise<Array>} A list of parsed emails.
   */
  async getAllEmails() {
    const imapClient = new ImapClient(this.email, this.password);
    await imapClient.connect();
    await imapClient.openInbox();

    const fetchOptions = {
      bodies: ['TEXT'],
      struct: true,
    };

    try {
      const emails = await imapClient.fetchEmails(['UNSEEN'], fetchOptions);
      const parsedEmails = emails.map((email) => EmailParser.parseEmail(email));
      return parsedEmails;
    } catch (error) {
      throw new Error(`Failed to retrieve emails: ${error.message}`);
    } finally {
      imapClient.end();
    }
  }

  /**
   * Sends an email with the specified parameters.
   * @param {string} to - The recipient's email address.
   * @param {string} subject - The subject of the email.
   * @param {string} text - The plain text content of the email.
   * @param {string} [html=''] - The HTML content of the email (optional).
   * @returns {Promise<string>} The ID of the sent message.
   * @throws {Error} Throws an error if the email sending fails.
   */
  async sendEmail(to, subject, text, html = '') {
    try {
      const messageId = await this.emailSender.sendEmail(to, subject, text, html);
      return messageId; // Retorna o ID da mensagem enviada
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Searches for emails by sender and subject.
   * @param {string} fromEmail - The sender's email address.
   * @param {string} subject - The subject of the email.
   * @returns {Promise<Array>} A list of matching emails.
   */
  async searchEmailBySenderAndSubject(fromEmail, subject) {
    const imapClient = new ImapClient(this.email, this.password);
    await imapClient.connect();
    await imapClient.openInbox();

    try {
      const emails = await imapClient.searchEmailBySenderAndSubject(fromEmail, subject);
      return emails;
    } catch (error) {
      throw new Error(`Failed to search emails by sender and subject: ${error.message}`);
    } finally {
      imapClient.end();
    }
  }

  /**
   * Clears all emails from the inbox.
   */
  async clearInbox() {
    const imapClient = new ImapClient(this.email, this.password);
    await imapClient.connect();
    await imapClient.openInbox();

    try {
      await imapClient.deleteAllEmails();
    } catch (error) {
      throw new Error(`Failed to clear inbox: ${error.message}`);
    } finally {
      imapClient.end();
    }
  }

  /**
   * Deletes an email by its ID.
   * @param {string} emailId - The ID of the email to be deleted.
   */
  async deleteEmail(emailId) {
    const imapClient = new ImapClient(this.email, this.password);
    await imapClient.connect();
    await imapClient.openInbox();

    try {
      await imapClient.deleteEmail(emailId);
    } catch (error) {
      throw new Error(`Failed to delete email with ID ${emailId}: ${error.message}`);
    } finally {
      imapClient.end();
    }
  }
}

module.exports = EmailService;
