import { SendInvitationContract } from "@/contracts/invites"
import { getUrl } from "@/trpc/shared"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { clerkClient } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { boats } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"

export const invitationsRouter = createTRPCRouter({
    sendBoatInvite: protectedProcedure
        .input(SendInvitationContract.requestSchema)
        .output(SendInvitationContract.responseSchema)
        .mutation(async ({ input, ctx }) => {
            const boat = await ctx.db.query.boats.findFirst({
                where: eq(boats.id, input.boatId),
                with: { crew: true }
            })
            if (!boat) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Boat with id '${input.boatId}' was not found`
                })
            }
            if (!boat.crew.some(cm => cm.userId === ctx.auth.userId)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED"
                })
            }
            if (ctx.auth.userId !== boat.captainUserId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Only the captain can invite new crew members"
                })
            }

            const createdInvitation = await clerkClient.invitations.createInvitation({
                ...input,
                redirectUrl: `${getUrl()}/dock/${input.boatId}`,
                publicMetadata: {
                    invitedByName: ctx.auth.user?.firstName,
                    boatName: boat.name
                }
            })
                
            return createdInvitation
        }),
})
    