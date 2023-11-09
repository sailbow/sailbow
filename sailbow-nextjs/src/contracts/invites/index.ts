import { type RequestResponseContract } from "@/contracts"
import { Invitation } from "@clerk/nextjs/server"
import { z } from "zod"

export const SendInvitationContract = {
    requestSchema: z.object({
        emailAddress: z.string().email(),
        boatId: z.number(),
        // redirectUrl: z.string().url().optional(),
        publicMetadata: z.any().nullish()
    }),
    responseSchema: z.custom<Invitation>()
} satisfies RequestResponseContract