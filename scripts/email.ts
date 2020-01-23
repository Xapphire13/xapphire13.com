import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  tls: {
    ciphers: "SSLv3"
  },
  auth: {
    user: "no-reply-x13@outlook.com",
    pass: "---"
  }
});

(async function () {
  await transport.sendMail({
    to: "---",
    subject: "Test message",
    text: "Testing that mail works with custom name"
  });
})();
