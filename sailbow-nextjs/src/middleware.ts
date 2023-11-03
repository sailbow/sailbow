import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
      publicRoutes: ['/'],
      afterAuth(auth, req) {
            // Redirect signed in user to /dock
            if (auth.userId && req.nextUrl.pathname === "/") {
                  return NextResponse.redirect(new URL("/dock", req.url))
            }
      }
})

export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
