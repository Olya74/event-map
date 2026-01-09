import nodemailer from "nodemailer";
import dotenv from "dotenv/config.js";
import ErrorHandler from "../exeptions/errorHandlung.js";

class MailService {
  transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password
      },
    });
  }
  async sendActivationMail(to: string, link: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to:process.env.EMAIL_USER ,// to, 
      subject: "Account Activation on " + process.env.API_URL,
      text: "",
      html: `<div>
          <h1>Welcome to ${process.env.API_NAME}!</h1>
          <p>To activate your account, please click the link below:</p>
          <a href="${link}">${link}</a>
          <p>If you did not create an account, please ignore this email.</p>
        </div>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Activation email sent:", info.response);
      return { message: "Activation email sent successfully!" };
    } catch (error) {
      console.error("Error sending activation email:", error);
      throw ErrorHandler.SendEmailError();
    }
  }
  async sendMail(from:string,to: string, subject: string, text: string) {
    const mailOptions = {
      from: from,
      to: to, 
      subject: subject,
      text: text,
      html: `<div>
          <h1>Welcome to ${process.env.API_NAME}!</h1>
          <p>${text}</p>
          <p>If you did not request this email, please ignore it.</p>
        </div>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return { message: `Email sent to ${to} successfully!` };
    } catch (error) {
      console.error("Error sending email:", error);
      throw ErrorHandler.SendEmailError();
    }
  }
}
export default new MailService();
