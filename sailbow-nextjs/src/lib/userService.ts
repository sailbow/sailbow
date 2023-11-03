import { currentUser } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/server";

export async function getUser(): Promise<User> {
    const user = await currentUser()
    return user as User
}