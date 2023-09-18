const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

class Email {
    constructor(user, url, resetToken) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.resetToken = resetToken;
        this.from = `Arpit Jana <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // Send Actual Email
    async send(template, subject) {
        // Render HTML based on a pug template
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject: subject,
                resetToken: this.resetToken,
            },
        );

        //  Define Email Options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: html,
            text: htmlToText(html),
        };

        //  Create a transport and send Email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the SafarSathi Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your Password reset token (valid for 10 minutes)',
        );
    }
}

module.exports = { Email };
