/**
 * Parser is responsible for parsing raw email data into a structured format.
 * It provides methods to extract and structure relevant email fields.
 */
class Parser {
    /**
     * Parses the raw email object into a structured format.
     * @param {Object} email - The raw email object to be parsed.
     * @returns {Object|null} The structured email object or null if the input is invalid.
     */
    static parseEmail(email) {
        if (!email) {
            throw new Error('Invalid email structure. The email object is null or undefined.');
        }

        return {
            id: email.uid || 'ID not found',
            subject: email.subject || 'Not found',
            fromName: email.from || 'Not found',
            fromEmail: this.extractEmailFromHeader(email.from) || 'Not found',
            date: email.date || 'Date not found',
            content: email.content || 'Email body not found',
        };
    }

    /**
     * Extracts the email address from a header string.
     * @param {string} header - The header string containing the email address.
     * @returns {string} The extracted email address or a default message if not found.
     */
    static extractEmailFromHeader(header) {
        const regex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
        const match = header ? header.match(regex) : null;
        return match ? match[0].trim() : 'Not found';
    }
}

module.exports = Parser;
