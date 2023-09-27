import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();
  return user && <h1>Welcome to Sailbow, {user.firstName}!</h1>;
}
