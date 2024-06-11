const Mailer = require('nodemailer');
exports.transportar = Mailer.createTransport({
    service: "gmail",
    auth: {
      user: "amanjot.1136@zenmonk.tech", // Your Gmail ID
      pass: "umif bfgz frxi cujf",         // Your Gmail Password umif bfgz frxi cujf
    },
  });

  