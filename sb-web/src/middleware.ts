import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {  NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/trips(.*)", '/(api|trpc)(.*)', '/accept-invite(.*)']);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    auth().protect();
  }
  return NextResponse.next();
}, {
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up"
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};