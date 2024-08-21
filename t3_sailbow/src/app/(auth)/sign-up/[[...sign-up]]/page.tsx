import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center overflow-hidden bg-white p-8">
      <SignUp fallbackRedirectUrl="/trips" />
    </div>
  );
}
