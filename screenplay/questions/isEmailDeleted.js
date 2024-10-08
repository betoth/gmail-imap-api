const GetEmailService = require('../interactions/getEmailService');

/**
 * IsEmailDeleted is a Question that checks if an email has been successfully deleted by its UID.
 */
class IsEmailDeleted {
  /**
   * Creates an instance of IsEmailDeleted.
   * @param {string} emailUid - The UID of the email to check for deletion.
   */
  constructor(emailUid) {
    this.emailUid = emailUid;
  }

  /**
   * Factory method to create a new instance of IsEmailDeleted.
   * @param {string} emailUid - The UID of the email to check for deletion.
   * @returns {IsEmailDeleted} An instance of IsEmailDeleted.
   */
  static perform(emailUid) {
    return new IsEmailDeleted(emailUid);
  }

  /**
   * Checks if the email with the specified UID has been deleted.
   * @param {Actor} actor - The actor performing the check.
   * @returns {Promise<boolean>} A promise that resolves to true if the email is deleted, otherwise false.
   */
  async answeredBy(actor) {
    const emailService = await GetEmailService.perform()(actor); // Obtains the email service
    const emails = await emailService.getAllEmails(); // Retrieves all emails

    // Checks if any email with the provided UID still exists
    const isDeleted = !emails.some(email => email.uid === this.emailUid);
    return isDeleted;
  }
}

module.exports = IsEmailDeleted;
