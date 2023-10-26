import { NextRequest, NextResponse } from 'next/server'
import { db } from "@/db";
import { boats, boatBanners, crewMembers } from '@/db/schema';
import { eq, } from 'drizzle-orm';
import { userService } from '@/lib';
import { createInsertSchema } from 'drizzle-zod';
import { revalidatePath } from 'next/cache';

const insertBoatSchema = createInsertSchema(boats)
    .omit({ id: true, captainUserId: true, createdOn: true})
    .extend({
        banner: createInsertSchema(boatBanners).omit({ boatId: true})
    })

async function GetUserBoats() {
    console.log('dock route')
    const user = await userService.getUser()
    const memberships = await db.query.crewMembers.findMany({
        where: eq(crewMembers.userId, user.id),
        with: { boat: true }
    })
    const boats = memberships.map(m => m.boat)
    return NextResponse.json(boats)
}

async function CreateBoat(req: NextRequest) {
    const body = await req.json()
    const validateResult = insertBoatSchema.safeParse(body)
    if (!validateResult.success) {
        console.log(`Invalid create boat request:\n${JSON.stringify(validateResult.error)}`)
        return NextResponse.json(validateResult.error, { status: 400 })
    }
    const user = await userService.getUser()
    const boat = {
        name: validateResult.data.name,
        description: validateResult.data.description,
        captainUserId: user.id
    }
    const insertBoatResult = await db.insert(boats).values(boat)
    const boatId: number = parseInt(insertBoatResult.insertId)
    const banner = {
        ...validateResult.data.banner,
        boatId: boatId
    }
    await db.insert(boatBanners).values(banner)
    await db.insert(crewMembers).values({ boatId, userId: user.id, role: "captain" })
    revalidatePath("/dock", "page")
    return NextResponse.json({ boatId })
}

export { GetUserBoats as GET, CreateBoat as POST }