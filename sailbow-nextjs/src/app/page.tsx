import { SignedOut, SignedIn, UserButton, SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs"

export default function Home() {
  return (
    <main>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <ClerkLoading>
          <div>Loading...</div>
        </ClerkLoading>
        <ClerkLoaded>
          <h1>Welcome to Sailbow!</h1>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </SignedIn>
    </main>
  )
}
