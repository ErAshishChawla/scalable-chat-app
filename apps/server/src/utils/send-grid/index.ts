import sgMail from "@sendgrid/mail";

import { EmailMessage } from "../../types/email-message";

import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async (message: EmailMessage) => {
  sgMail
    .send(message)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
};
