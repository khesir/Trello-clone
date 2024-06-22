import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public and organization route matchers
const isPublicRoute = createRouteMatcher(['/sign-in', '/sign-up']);
const isOrganizationRoute = createRouteMatcher(['/organization(.*)']);

export default clerkMiddleware((auth, req) => {
  const { userId, orgId } = auth();

  // Handle unauthenticated access to private routes
  if (!userId && !isPublicRoute(req)) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  // Handle authenticated user without org trying to access non-organization routes
  if (userId && !orgId && req.nextUrl.pathname !== "/select-org") {
    const orgSelection = new URL("/select-org", req.url);
    return NextResponse.redirect(orgSelection);
  }

  // Handle authenticated user accessing public routes
  if (userId && isPublicRoute(req)) {
    let path = '/select-org';
    if (orgId) {
      path = `/organization/${orgId}`;
    }
    const redirectUrl = new URL(path, req.url);
    return NextResponse.redirect(redirectUrl);
  }

});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
