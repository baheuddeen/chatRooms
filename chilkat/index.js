const chilkat = require('@chilkat/ck-node14-linux64');

module.exports = () => {
    var mailman = new chilkat.MailMan();

    // Set the SMTP server.  Perhaps it is the local machine.
    mailman.SmtpHost = "20.106.245.63";
    // Or perhaps it's a particular computer on the local network:
    // mailman.SmtpHost = "192.168.1.123";
    // // Or provide a local domain that resolves to an IP address on the local network:
    // mailman.SmtpHost = "mymailsesrver.com";

    // Set the SmtpAuthMethod property = "NONE"
    mailman.SmtpAuthMethod = "NONE";

    // Set the SMTP login/password (this may be omitted given no authentication will take place)
    // mailman.SmtpUsername = "myUsername";
    // mailman.SmtpPassword = "myPassword";

    // Create a new email object
    var email = new chilkat.Email();

    email.Subject = "This is a test";
    email.Body = "This is a test";
    email.From = "Chilkat Support <verification@mbahy.com>";
    var success = email.AddTo("Chilkat Admin","muhammad.baheuddeen@gmail.com");
    // To add more recipients, call AddTo, AddCC, or AddBcc once per recipient.

    // Call SendEmail to connect to the SMTP server and send.
    // The connection (i.e. session) to the SMTP server remains
    // open so that subsequent SendEmail calls may use the
    // same connection.  
    success = mailman.SendEmail(email);
    if (success !== true) {
        console.log(mailman.LastErrorText);
        return;
    }

    // Some SMTP servers do not actually send the email until 
    // the connection is closed.  In these cases, it is necessary to
    // call CloseSmtpConnection for the mail to be  sent.  
    // Most SMTP servers send the email immediately, and it is 
    // not required to close the connection.  We'll close it here
    // for the example:
    success = mailman.CloseSmtpConnection();
    if (success !== true) {
        console.log("Connection to SMTP server not closed cleanly.");

    }

    console.log("Mail Sent!");

}