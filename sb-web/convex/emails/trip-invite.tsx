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
import TwConfig from "@convex/emails/tailwind-config";
import { getBaseUrl } from "@convex/_lib/utils";

const tripInviteSchema = z.object({
  inviteId: z.string().min(1),
  tripName: z.string().min(1),
  invitedByName: z.string(),
  invitedByEmail: z.string().email(),
  inviteeEmail: z.string().email(),
});

type TripInvite = z.infer<typeof tripInviteSchema>;

const baseUrl = getBaseUrl();

const TripInviteTemplate = (invite: TripInvite) => {
  return (
    <Tailwind config={TwConfig}>
      <Html lang="en">
        <Body className="mx-auto my-auto bg-background px-2 font-sans antialiased">
          <Container className="mx-auto my-[40px] flex max-w-[465px] flex-col items-start justify-around rounded border border-border p-[20px]">
            <Section>
              <Img
                src="https://raw.githubusercontent.com/sailbow/sailbow/main/sb-web/public/icon.svg"
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
              <strong>{invite.tripName}</strong> on <strong>Sailbow</strong>.
            </Text>
            <Section className="text-center">
              <Button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                href={`${baseUrl}/accept-invite/${invite.inviteId}`}
              >
                Accept invite
              </Button>
            </Section>
            <Text>
              or copy and paste this URL into your browser:{" "}
              <Link
                href={`${baseUrl}/accept-invite/${invite.inviteId}`}
                className="text-blue-600"
              >
                {`${baseUrl}/accept-invite/${invite.inviteId}`}
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
      </Html>
    </Tailwind>
  );
};

TripInviteTemplate.PreviewProps = {
  inviteId: 1,
  tripId: 1,
  tripName: "Test Trip Name",
  inviteeEmail: "test@example.com",
  invitedByName: "Jane Doe",
  invitedByEmail: "test@example.com",
};

export default TripInviteTemplate;
