import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex w-dvw items-center justify-center p-8">
      <SignUp fallbackRedirectUrl="/trips" />
    </div>
  );
}
