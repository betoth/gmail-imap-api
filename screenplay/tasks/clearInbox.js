const GetEmailService = require('../interactions/getEmailService');

/**
 * ClearInbox is a task that clears all emails from the inbox.
 * It uses the email service to perform the deletion of all messages.
 */
class ClearInbox {
  /**
   * Creates an instance of the ClearInbox task.
   * @returns {Function} A function that accepts an actor and performs the task of clearing the inbox.
   */
  static perform() {
    return async (actor) => {
      const emailService = await GetEmailService.perform()(actor); // Using the interaction to get the emailService
      await emailService.clearInbox(); // Using the clearInbox method directly from the email service
    };
  }
}

module.exports = ClearInbox;
