import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex w-dvw items-center justify-center p-8">
      <SignIn fallbackRedirectUrl="/trips" />
    </div>
  );
}
