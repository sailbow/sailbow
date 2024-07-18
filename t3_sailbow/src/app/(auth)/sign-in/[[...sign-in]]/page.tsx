import { SignIn } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { useAuth } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex w-dvw items-center justify-center p-8">
      <SignIn fallbackRedirectUrl="/dock" />
    </div>
  );
}
