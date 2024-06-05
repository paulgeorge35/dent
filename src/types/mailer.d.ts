type MailerTemplate = "welcome-register" | "magic-link" | "otp";

type MailerWelcomeContext = {
  name: string;
  link: string;
};

type MailerMaginLinkContext = {
  name: string;
  link: string;
};

type MailerOTPContext = {
  name: string;
  otp: string;
};

export type MailerContext =
  | MailerWelcomeContext
  | MailerMaginLinkContext
  | MailerOTPContext;

export type MailerTransaction = {
  to: string;
  subject: string;
  template: MailerTemplate;
  context: MailerContext;
};
