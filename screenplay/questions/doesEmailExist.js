const GetEmailService = require('../interactions/getEmailService');

/**
 * Represents a question to check if an email exists based on the sender's address and subject.
 * This question is used in the Screenplay Pattern to verify the presence of a specific email in the actor's inbox.
 */
class DoesEmailExist {
  /**
   * Initializes a new instance of the DoesEmailExist question.
   * @param {string} fromEmail - The sender's email address.
   * @param {string} subject - The subject of the email to search for.
   */
  constructor(fromEmail, subject) {
    this.fromEmail = fromEmail;
    this.subject = subject;
  }

  /**
   * Static method to create an instance of DoesEmailExist.
   * @param {string} fromEmail - The sender's email address.
   * @param {string} subject - The subject of the email to search for.
   * @returns {DoesEmailExist} An instance of the DoesEmailExist question.
   */
  static perform(fromEmail, subject) {
    return new DoesEmailExist(fromEmail, subject);
  }

  /**
   * Asks the question to check if an email with the specified sender and subject exists.
   * @param {object} actor - The actor asking the question.
   * @returns {Promise<Object|null>} Resolves with the first email found matching the criteria or null if no email is found.
   */
  async answeredBy(actor) {
    const emailService = await GetEmailService.perform()(actor); // Retrieves the email service using the interaction
    const emails = await emailService.searchEmailBySenderAndSubject(this.fromEmail, this.subject); // Searches for emails based on the criteria

    // Return the first email found or null if no email is found
    return (Array.isArray(emails) && emails.length > 0) ? emails[0] : null;
  }
}

module.exports = DoesEmailExist;
