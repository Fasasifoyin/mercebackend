import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import * as dotenv from "dotenv";
import ENV from "../utils/validateEnv";

dotenv.config();

type EmailBody = {
  email: string;
  name: string;
  text: string;
  subject: string;
};

export const sendMail = async (body: EmailBody) => {
  const { email, name, text, subject } = body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: ENV.USER,
        clientId: ENV.CLIENT_ID,
        clientSecret: ENV.CLIENT_SECRET,
        refreshToken: ENV.REFRESH_TOKEN,
        accessToken: ENV.ACCESS_TOKEN,
        tls: {
          rejectUnauthorized: false,
        },
      },
    } as nodemailer.TransportOptions);

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Foodmerce",
        link: "https://shome.js",
      },
    });

    let response = {
      body: {
        name,
        intro: text,
        outro: "Need help? Send a message to this email",
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: ENV.USER,
      to: email,
      subject: subject,
      html: mail,
    };

    await transporter.sendMail(message);
    return { message: "Success", status: 201 };
    
  } catch (error) {
    let errorMessage = "An error occured while sending email";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { message: errorMessage, status: 500 };
  }
};
