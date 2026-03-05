import nodemailer from "nodemailer";
import ErrorHandler from "../exeptions/errorHandlung.js";

class MailService {
  private transporter;
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
      return { message: `Email sent to ${to} successfully!` };
    } catch (error) {
      console.error("Error sending email:", error);
      throw ErrorHandler.SendEmailError();
    }
  }
    async sendEventSubscriptionEmail(to: string, eventTitle: string,link: string){
       await this.transporter.sendMail({
      from: `"Event App" <${process.env.EMAIL_USER}>`,
      to:process.env.EMAIL_USER ,// to, 
      subject: "You subscribed to an event 🎉",
      html: `
        <h2 style="color: green;">Subscription Confirmed</h2>
        <p>You have successfully subscribed to the event <b>${eventTitle}</b>.</p>
        <p>When you don't want to attend anymore, you can unsubscribe here: <a href="${link}">${link}</a></p>
      `,
    });
    }
    async sendEventUnsubscriptionEmail(to: string, eventTitle: string){
       await this.transporter.sendMail({
      from: `"Event App" <${process.env.EMAIL_USER}>`,
      to:process.env.EMAIL_USER ,// to, 
      subject: "Вы отписались от события ❌",
      html: `
        <h2 style="color: red;">Отписка выполнена</h2>
        <p>Вы успешно отписались от события <b>${eventTitle}</b>.</p>
      `,
    });
    }
}
export default new MailService();
