import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Preview } from "@react-email/preview";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { DateTime } from "luxon";
interface SupportTicketProps {
  user: {
    id: string;
    role: string;
    tenant: {
      profile: {
        name: string;
        phone: string | null;
        plan: {
          name: string;
        };
        createdAt: Date;
      };
    };
    profile: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  title: string;
  description: string;
}

export const SupportTicket = ({
  user,
  title,
  description,
}: SupportTicketProps) => {
  const previewText = `New support ticket from ${user.profile.firstName} ${user.profile.lastName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={global.heading}>New Support Ticket</Heading>

          <Hr style={global.hr} />

          <Section style={section}>
            <Text style={global.text}>
              <strong>From:</strong> {user.profile.firstName}{" "}
              {user.profile.lastName} ({user.profile.email})
            </Text>
            <Text style={global.text}>
              <strong>Clinic:</strong> {user.tenant.profile.name}
            </Text>
            <Text style={global.text}>
              <strong>Plan:</strong> {user.tenant.profile.plan.name}
            </Text>
            <Text style={global.text}>
              <strong>User Role:</strong> {user.role}
            </Text>
            <Text style={global.text}>
              <strong>Phone:</strong> {user.tenant.profile.phone || "N/A"}
            </Text>
            <Text style={global.text}>
              <strong>Member Since:</strong>{" "}
              {DateTime.fromJSDate(user.tenant.profile.createdAt).toFormat(
                "DDD, LLL dd, yyyy HH:mm",
              )}
            </Text>
          </Section>

          <Hr style={global.hr} />

          <Section style={section}>
            <Text style={global.text}>
              <strong>Title:</strong> {title}
            </Text>
            <Text style={global.text}>
              <strong>Description:</strong>
            </Text>
            <Text style={{ ...global.text, whiteSpace: "pre-wrap" }}>
              {description}
            </Text>
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
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
};

const container = {
  margin: "10px auto",
  width: "600px",
  maxWidth: "100%",
  border: "1px solid #E5E5E5",
};

const section = {
  padding: "20px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
};

const subheading: React.CSSProperties = {
  padding: "20px",
  fontSize: "20px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#0f172a",
};

const global = {
  heading: {
    color: "#0f172a",
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  } as React.CSSProperties,
  text: {
    margin: "0",
    lineHeight: "2",
    color: "#4b5563",
    fontWeight: "500",
  },
  muted: {
    margin: "0",
    lineHeight: "2",
    color: "#9ca3af",
    fontWeight: "500",
  },
  hr: {
    borderColor: "#E5E5E5",
    margin: "0",
  },
};

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

export default SupportTicket;
