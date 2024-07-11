import * as React from "react";
import { z } from "zod";
import {
  Body,
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import TwConfig from "./_components/tailwind-config";

const boatInviteSchema = z.object({
  boatId: z.number().min(1),
  boatName: z.string().min(1).max(50),
  invitedByName: z.string(),
  invitedByEmail: z.string().email(),
  inviteeEmail: z.string().email(),
});

type BoatInvite = z.infer<typeof boatInviteSchema>;

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const baseUrl = getBaseUrl();

const BoatInviteTemplate = (invite: BoatInvite) => {
  return (
    <Html lang="en">
      <Tailwind config={TwConfig}>
        <Body className="mx-auto my-auto bg-white px-2 font-sans antialiased">
          <Container className="mx-auto my-[40px] flex max-w-[465px] flex-col items-start justify-around rounded border border-border p-[20px]">
            <Section>
              <Img
                src="/static/sailbow.png"
                width="50"
                height="50"
                alt="Sailbow"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="p-0 text-center text-xl font-normal">
              Join <strong>{invite.invitedByName}</strong> on{" "}
              <strong>Sailbow</strong>
            </Heading>
            <Text>Hello,</Text>
            <Text>
              <strong>{invite.invitedByName}</strong> (
              <Link
                href={`mailto:${invite.invitedByEmail}`}
                className="text- no-underline"
              >
                {invite.invitedByEmail}
              </Link>
              ) has invited you to the group trip{" "}
              <strong>{invite.boatName}</strong> on <strong>Sailbow</strong>.
            </Text>
            <Section className="text-center">
              <Button
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-[#36adf2]/90
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                href={`${baseUrl}/dock/${invite.boatId}`}
              >
                Accept invite
              </Button>
            </Section>
            <Text>
              or copy and paste this URL into your browser:{" "}
              <Link
                href={`${baseUrl}/dock/${invite.boatId}`}
                className="text-blue-600"
              >
                {`${baseUrl}/dock/${invite.boatId}`}
              </Link>
            </Text>
            <Hr className="w-full border border-solid border-[#eaeaea]" />
            <Text className="text-muted] text-[12px] leading-[24px]">
              This invitation was intended for{" "}
              <span>
                <strong>{invite.inviteeEmail}</strong>
              </span>
              . If you were not expecting this invitation, you can ignore this
              email. If you are concerned about the safety of your account,
              please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

BoatInviteTemplate.PreviewProps = {
  boatId: 1,
  boatName: "Test Boat Name",
  inviteeEmail: "test@example.com",
  invitedByName: "Jane Doe",
  invitedByEmail: "test@example.com",
};

export default BoatInviteTemplate;
