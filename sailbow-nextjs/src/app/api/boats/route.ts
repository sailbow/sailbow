import { NextResponse } from 'next/server'
import { db } from "@/db";
import { crewMembers } from '@/db/schema';
import { eq, } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs';
import { userService } from '@/lib';

export async function GET() {
    console.log(await currentUser())
    const user = await userService.getUser()
    const memberships = await db.query.crewMembers.findMany({
        where: eq(crewMembers.userId, user.id),
        with: { boat: true }
    })
    const boats = memberships.map(m => m.boat)
    return NextResponse.json(boats)
}