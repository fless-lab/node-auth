require('dotenv').config()

module.exports = {
    mailOptions: {
      from: process.env.NODE_MAILER_SENDER,
      to: "test-user@mail.com",
      subject: "Just Testing Mail Service",
    },
    transporterOptions: {
        host: process.env.NODE_MAILER_HOST,
        port: process.env.NODE_MAILER_PORT,
        auth: {
          user: process.env.NODE_MAILER_USERNAME,
          pass: process.env.NODE_MAILER_PASSWORD,
        },
    },
  };