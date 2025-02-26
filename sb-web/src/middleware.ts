import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {  NextResponse } from "next/server";

const isIndexOrSignInRoute = createRouteMatcher(["/", "/sign-in", "/sign-up"]);
const isProtectedRoute = createRouteMatcher(["/trips(.*)", '/(api|trpc)(.*)', '/accept-invite(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (isIndexOrSignInRoute(request)){
    if ((await auth()).userId) {
      return NextResponse.redirect(new URL("/trips", request.url));
    }
  }
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
  return NextResponse.next();
}, {
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up"
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};