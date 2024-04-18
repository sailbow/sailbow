import { z } from "zod";
import { captainMiddleware, createTRPCRouter, protectedProcedure } from "../trpc";
import { crewMembers } from "@/server/db/schema";
import { resend } from "@/lib/resend";
import { BoatInviteTemplate } from "emails";
import { TRPCError } from "@trpc/server";

export const crewRouter = createTRPCRouter({
  inviteCrewMember: protectedProcedure
    .use(captainMiddleware)
    .input(z.object({
      email: z.string().email(),
      role: z.enum(["crewMember", "firstMate"])
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.boat.crew.findIndex(cm => cm.email == input.email) !== -1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `User with email '${input.email}' has already been invited!`,
        });
      }
      await ctx.db.insert(crewMembers).values({
        boatId: ctx.boat.id,
        email: input.email,
        role: input.role
      });
      // await resend.emails.send({
      //   from: "onboarding@resend.dev",
      //   to: "sailbowapp@gmail.com",
      //   subject: "You've been invited!",
      //   react: BoatInviteTemplate({ 
      //     boatId: ctx.boat.id,
      //     boatName: ctx.boat.name,
      //     invitedByEmail: ctx.auth.primaryEmail,
      //     invitedByName: `${ctx.auth.user?.firstName} ${ctx.auth.user?.lastName}`,
      //     inviteeEmail: input.email
      //   })
      // });
    })
})