import { env } from "@/env";
import type {
  MailerMaginLinkContext,
  MailerOTPContext,
  MailerTransaction,
  MailerWelcomeContext,
} from "@/types/mailer";
import { createTransport } from "nodemailer";

class Mailer {
  private companyName = env.EMAIL_LABEL;

  private transporter = createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  async send(transaction: MailerTransaction) {
    await this.transporter.sendMail({
      from: `"${env.EMAIL_LABEL}" <${env.EMAIL_USER}>`,
      to: transaction.to,
      subject: transaction.subject,
      html: this.getTemplate(transaction),
    });
  }

  private getTemplate(transaction: MailerTransaction) {
    switch (transaction.template) {
      case "welcome-register":
        return this.getWelcomeRegisterTemplate(
          transaction.context as MailerWelcomeContext,
        );
      case "magic-link":
        return this.getMagicLinkTemplate(
          transaction.context as MailerMaginLinkContext,
        );
      case "otp":
        return this.getOTPTemplate(transaction.context as MailerOTPContext);
    }
  }

  private getWelcomeRegisterTemplate(context: MailerWelcomeContext) {
    return `
      <h1>Welcome ${context.name}!</h1>
      <p>
        Thank you for registering! Please click the link below to verify your account.
      </p>
      <a href="${context.link}">Verify Account</a>
      <br />
      <p>
        ${this.companyName} Team
      </p>
    `;
  }

  private getMagicLinkTemplate(context: MailerMaginLinkContext) {
    return `
      <h1>Welcome ${context.name}!</h1>
      <p>
        Please click the link below to log in.
        This link will expire in 15 minutes.
      </p>
      <a href="${context.link}">Log In</a>
      <br />
      <p>
        ${this.companyName} Team
      </p>
    `;
  }

  private getOTPTemplate(context: MailerOTPContext) {
    return `
      <h1>Welcome ${context.name}!</h1>
      <p>
        Your OTP is ${context.otp}.
      </p>
      <br />
      <p>
        ${this.companyName} Team
      </p>
    `;
  }
}

const createMailer = () => new Mailer();

const globalForMailer = globalThis as unknown as {
  mailer: ReturnType<typeof createMailer> | undefined;
};

export const mailer = globalForMailer.mailer ?? createMailer();

if (env.NODE_ENV !== "production") globalForMailer.mailer = mailer;
