import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";

interface WelcomeProps {
  name: string;
  url: string;
  verify?: boolean;
}

export const Welcome = ({ name, verify = false, url }: WelcomeProps) => (
  <Html>
    <Head>
      <Preview>Your MyDent account is ready!</Preview>
    </Head>
    <Body style={main}>
      <Container style={container}>
        <Section style={message}>
          <Heading style={global.heading}>Welcome to MyDent!</Heading>
          <Text style={global.text}>Hi {name},</Text>
          <Text style={global.text}>
            Welcome to <strong>MyDent</strong>! We&apos;re excited to have you
            on board. Please let us know if you have any questions.
          </Text>

          {verify ? (
            <>
              <Text style={global.text}>
                Before you get started, please verify your email address by
                clicking the link below:
              </Text>
              <Link style={{ ...marginY, ...global.link }} href={url}>
                Verify your email address
              </Link>
            </>
          ) : (
            <>
              <Text style={global.text}>
                To get started, please click the link below:
              </Text>
              <Link style={{ ...marginY, ...global.link }} href={url}>
                Get started
              </Link>
            </>
          )}
        </Section>

        <Hr style={global.hr} />

        <Section style={paddingY}>
          <Row>
            <Text style={footer.text}>
              Please contact us if you have any questions.
            </Text>
            <Text style={footer.text}>
              (If you reply to this email, we won&apos;t be able to see it.)
            </Text>
          </Row>
          <Row>
            <Text style={footer.text}>©MyDent. All Rights Reserved.</Text>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>
);

const paddingX = {
  paddingLeft: "40px",
  paddingRight: "40px",
};

const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
};

const marginY = {
  marginTop: "22px",
  marginBottom: "22px",
};

const paragraph = {
  margin: "0",
  lineHeight: "2",
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: "bold" },
  heading: {
    color: "#0f172a",
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  } as React.CSSProperties,
  link: {
    display: "inline-block",
    color: "#f8fafc",
    textDecoration: "none",
    fontWeight: "500",
    backgroundColor: "#0f172a",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    borderRadius: "8px",
    padding: "8px 16px",
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: "#747474",
    fontWeight: "500",
  },
  muted: {
    ...paragraph,
    color: "#AFAFAF",
    fontWeight: "500",
  },
  button: {
    border: "1px solid #929292",
    fontSize: "16px",
    textDecoration: "none",
    padding: "10px 0px",
    width: "220px",
    display: "block",
    textAlign: "center",
    fontWeight: 500,
    color: "#000",
  } as React.CSSProperties,
  hr: {
    borderColor: "#E5E5E5",
    margin: "0",
  },
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  width: "600px",
  maxWidth: "100%",
  border: "1px solid #E5E5E5",
};

const message = {
  padding: "40px 74px",
  textAlign: "center",
} as React.CSSProperties;

const footer = {
  policy: {
    width: "166px",
    margin: "auto",
  },
  text: {
    margin: "0",
    color: "#AFAFAF",
    fontSize: "13px",
    textAlign: "center",
    textWrap: "balance",
  } as React.CSSProperties,
};
