import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center overflow-hidden bg-white p-8">
      <SignIn fallbackRedirectUrl="/trips" />
    </div>
  );
}
