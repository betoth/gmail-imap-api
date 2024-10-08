const EmailService = require('../../infra/email/emailService');

/**
 * The ManageEmails class encapsulates email operations by utilizing the EmailService.
 * It provides a way to interact with the EmailService using specified credentials.
 */
class ManageEmails {
  /**
   * Creates an instance of ManageEmails with the provided EmailService instance.
   * @param {EmailService} emailService - The EmailService instance to manage email operations.
   */
  constructor(emailService) {
    this._emailService = emailService;
  }

  /**
   * Static method to instantiate ManageEmails using provided email credentials.
   * @param {string} email - The email address for authentication.
   * @param {string} password - The password for authentication.
   * @returns {ManageEmails} A new instance of ManageEmails with the configured EmailService.
   * @throws {Error} If the email or password is not provided.
   */
  static usingCredentials(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required to set up ManageEmails.');
    }
    const emailService = new EmailService(email, password);
    return new ManageEmails(emailService);
  }

  /**
   * Getter method to access the EmailService instance.
   * @returns {EmailService} The EmailService instance.
   */
  getEmailService() {
    return this._emailService;
  }
}

module.exports = ManageEmails;
