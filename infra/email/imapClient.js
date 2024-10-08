const Imap = require('node-imap');

/**
 * ImapClient handles IMAP operations such as connecting to the server, fetching, and deleting emails.
 */
class ImapClient {
  /**
   * Creates an instance of ImapClient with the specified email and password.
   * @param {string} email - The email address to use for authentication.
   * @param {string} password - The password to use for authentication.
   */
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.imap = new Imap({
      user: email,
      password: password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });
  }

  /**
   * Connects to the IMAP server.
   * @returns {Promise} Resolves when the connection is successfully established.
   */
  connect() {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', resolve);
      this.imap.once('error', reject);
      this.imap.connect();
    });
  }

  /**
   * Opens the inbox in read-write mode.
   * @returns {Promise<Object>} Resolves with the inbox information.
   */
  openInbox() {
    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          reject(err);
        } else {
          resolve(box);
        }
      });
    });
  }

  /**
   * Searches emails by sender and subject.
   * @param {string} fromEmail - The sender's email address.
   * @param {string} subject - The subject of the email.
   * @returns {Promise<Array>} Resolves with the list of email objects matching the criteria.
   */
  searchEmailBySenderAndSubject(fromEmail, subject) {
    return new Promise((resolve, reject) => {
      this.imap.search([['FROM', fromEmail], ['SUBJECT', subject]], (err, results) => {
        if (err) {
          reject(new Error(`Failed to search emails by sender and subject: ${err.message}`));
          return;
        }

        if (results.length === 0) {
          resolve([]); // No emails found matching the criteria
          return;
        }

        this.fetchEmailsContent(results).then(resolve).catch(reject);
      });
    });
  }

  /**
   * Fetches emails based on the given criteria.
   * @param {Array} criteria - The search criteria for fetching emails.
   * @param {Object} fetchOptions - Options for fetching email bodies and structures.
   * @returns {Promise<Array>} Resolves with the list of emails found.
   */
  async fetchEmails(criteria = ['UNSEEN'], fetchOptions = { bodies: ['TEXT'], struct: true }) {
    try {
      const emails = await this.searchEmails(criteria);
      return emails;
    } catch (error) {
      throw new Error(`Failed to fetch emails: ${error.message}`);
    }
  }

  /**
   * Searches emails using the given criteria.
   * @param {Array} criteria - The search criteria for finding emails.
   * @returns {Promise<Array>} Resolves with the list of email UIDs that match the criteria.
   */
  searchEmails(criteria) {
    return new Promise((resolve, reject) => {
      this.imap.search(criteria, (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        if (results.length === 0) {
          resolve([]);
          return;
        }

        this.fetchEmailsContent(results).then(resolve).catch(reject);
      });
    });
  }

  /**
   * Fetches the content of the emails by their UIDs.
   * @param {Array} messageUids - The UIDs of the emails to fetch.
   * @returns {Promise<Array>} Resolves with the list of email objects.
   */
  fetchEmailsContent(messageUids) {
    return new Promise((resolve, reject) => {
      const messages = [];
      const fetch = this.imap.fetch(messageUids, { bodies: '' });

      fetch.on('message', (msg) => {
        let email = { subject: '', from: '', date: '', content: '' };

        msg.on('body', (stream) => {
          let buffer = '';
          stream.on('data', (chunk) => {
            buffer += chunk.toString('utf8');
          });

          stream.once('end', () => {
            email = {
              ...email,
              subject: ImapClient.extractHeader(buffer, 'subject'),
              from: ImapClient.extractHeader(buffer, 'from'),
              date: ImapClient.extractHeader(buffer, 'date'),
              content: ImapClient.extractBody(buffer),
            };
          });
        });

        msg.once('attributes', (attrs) => {
          email.uid = attrs.uid;
        });

        msg.once('end', () => {
          messages.push(email);
        });
      });

      fetch.once('error', reject);
      fetch.once('end', () => {
        resolve(messages);
      });
    });
  }

  /**
   * Extracts a specific header from the email body.
   * @param {string} buffer - The raw email data.
   * @param {string} headerName - The name of the header to extract.
   * @returns {string} The extracted header value.
   */
  static extractHeader(buffer, headerName) {
    const match = buffer.match(new RegExp(`${headerName}: (.*)`, 'i'));
    return match ? match[1].trim() : 'Not Found';
  }

  /**
   * Extracts the body of the email from the buffer.
   * @param {string} buffer - The raw email data.
   * @returns {string} The extracted email body.
   */
  static extractBody(buffer) {
    const bodyStartIndex = buffer.indexOf('\r\n\r\n');
    return bodyStartIndex !== -1 ? buffer.substring(bodyStartIndex).trim() : 'Email body not found';
  }

  /**
   * Deletes an email by its UID.
   * @param {string} emailId - The UID of the email to delete.
   * @returns {Promise} Resolves when the email is successfully deleted.
   */
  deleteEmail(emailId) {
    return new Promise((resolve, reject) => {
      this.imap.addFlags(emailId, '\\Deleted', (err) => {
        if (err) {
          reject(err);
          return;
        }
        this.imap.expunge((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  }

  /**
   * Deletes all emails in the inbox.
   * @returns {Promise} Resolves when all emails are successfully marked for deletion and expunged.
   */
  deleteAllEmails() {
    return new Promise((resolve, reject) => {
      this.imap.search(['ALL'], (err, results) => {
        if (err) {
          reject(new Error(`Failed to search emails for deletion: ${err.message}`));
          return;
        }

        if (results.length === 0) {
          resolve(); // No emails to delete
          return;
        }

        this.imap.addFlags(results, '\\Deleted', (flagErr) => {
          if (flagErr) {
            reject(new Error(`Failed to mark emails as deleted: ${flagErr.message}`));
            return;
          }

          this.imap.expunge((expungeErr) => {
            if (expungeErr) {
              reject(new Error(`Failed to expunge emails: ${expungeErr.message}`));
              return;
            }
            resolve(); // All emails successfully deleted
          });
        });
      });
    });
  }

  /**
   * Ends the IMAP connection.
   */
  end() {
    this.imap.end();
  }
}

module.exports = ImapClient;
