"use strict";
const nodemailer = require("nodemailer");
const previewEmail = require('preview-email');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "kgr.info@gmail.com",
    pass: "pwmu lzxu sdbp elpi",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(receiver,message,subject) {
  // send mail with defined transport object

  //previewEmail(message).then(console.log).catch(console.error);

  try{

    console.log("receiver : "+receiver);

    const info = await transporter.sendMail({
      from: '"K gangadhar" <kgr.info@gmail.com>', // sender address
      to: `${receiver}`, // list of receivers
      subject: subject, // Subject line
      text: `${message}`, // plain text body
      html: message.html, // html body
    });
    console.log("Message sent: %s with "+message, info.messageId);
  }
catch{
  return console.log("error occured")
}


  
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

//main().catch(console.error);

module.exports = {main};