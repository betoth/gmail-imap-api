const GetEmailService = require('../interactions/getEmailService');

/**
 * ReadAllEmails is a task that retrieves all emails from the inbox.
 * It utilizes the email service to fetch the emails.
 */
class ReadAllEmails {
  /**
   * Creates an instance of the ReadAllEmails task.
   * @returns {Function} A function that accepts an actor and performs the task of reading all emails.
   */
  static perform() {
    return async (actor) => {
      const emailService = await GetEmailService.perform()(actor); // Using the interaction to get the emailService
      const emails = await emailService.getAllEmails(); // Directly calling the getAllEmails method from the email service
      return emails;
    };
  }
}

module.exports = ReadAllEmails;
