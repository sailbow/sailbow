import { SignIn } from "@clerk/react";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/trips", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="flex h-dvh w-dvw items-center justify-center overflow-hidden bg-white p-8">
      <SignIn forceRedirectUrl="/trips" fallbackRedirectUrl="/trips" />
    </div>
  );
}
