import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  token: string;
}

export default function verifyUserEmail({
  username,
  token,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      {/* <Preview>Here&apos;s your verification code: {otp}</Preview> */}
      <Section
        style={{
          backgroundColor: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Row style={{ textAlign: "center", marginBottom: "20px" }}>
          <Heading as="h1" style={{ color: "#333", fontSize: "24px" }}>
            Welcome, {username}!
          </Heading>
        </Row>
        <Row style={{ textAlign: "center", marginBottom: "10px" }}>
          <Text style={{ fontSize: "16px", color: "#666" }}>
            Please use the following verification link to change your account
            password
          </Text>
        </Row>
        <Row style={{ textAlign: "center" }}>
          <Button
            href={`http://localhost:3000/changePassword/${token}`}
            style={{
              backgroundColor: "#61dafb",
              color: "#fff",
              borderRadius: "5px",
              padding: "10px 20px",
              textDecoration: "none",
            }}
          >
            Change Password
          </Button>
        </Row>
        <Row style={{ textAlign: "center", marginBottom: "10px" }}>
          <Text style={{ fontSize: "14px", color: "#999" }}>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
