import nodemailer from 'nodemailer';

const email = async (obj) => {
  const transport = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const message = {
    from: process.env.GMAIL_USERNAME,
    to: obj.to,
    subject: obj.subject,
    text: obj.message,
  };

  await transport.sendMail(message);
};

export default email;
