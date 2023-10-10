import { currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";

export async function getUser(): Promise<User> {
    const user = await currentUser()
    return user as User
}