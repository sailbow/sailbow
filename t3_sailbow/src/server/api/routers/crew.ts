import { z } from "zod";
import { createTRPCRouter, protectedBoatMiddleware, protectedProcedure, requiredRoleMiddleware } from "../trpc";
import { crewMembers } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { clerkClient, type User } from "@clerk/nextjs/server";
import { GetPrimaryEmail } from "@/lib/user";
// import { resend } from "@/lib/resend";
// import { BoatInviteTemplate } from "emails";

const crewMemberSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  imageUrl: z.string(),
  email: z.string().email(),
});

export const crewRouter = createTRPCRouter({
  inviteCrewMember: protectedProcedure
    .use(requiredRoleMiddleware(["captain", "firstMate"]))
    .input(z.object({
      email: z.string().email(),
      role: z.enum(["crewMember", "firstMate"])
    }))
    .mutation(async ({ input, ctx }) => {
      const cmIndex = ctx.boat.crew.findIndex(cm => cm.email == input.email)
      if (cmIndex !== -1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `User with email '${input.email}' has already been invited!`,
        });
      }
      const users = (await clerkClient.users.getUserList({
        emailAddress: [ input.email ]
      }));
      
      await ctx.db.insert(crewMembers).values({
        userId: users[0]?.id,
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
    }),

  getCrew: protectedProcedure
    .use(protectedBoatMiddleware)
    .input(z.object({
      page: z.number().min(1).default(1),
      perPage: z.number().multipleOf(5).max(100).default(5)
    }))
    .output(z.array(crewMemberSchema))
    .query(async ({ input, ctx }) => {
      const users: User[] = await clerkClient.users.getUserList({
        emailAddress: ctx.boat.crew.map(cm => cm.email),
        limit: input.perPage,
        offset: (input.page - 1) * input.perPage
      });
      return users.map(u => ({
        id: u.id,
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        imageUrl: u.imageUrl,
        email: GetPrimaryEmail(u)
      }))
    })
})