import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/','/sign-in','/sign-up'])

const isOrganizationRoute = createRouteMatcher(['/organization(.*)'])
export default clerkMiddleware((auth, req) => {
  const {userId, orgId} = auth()
  // User tries to access a private route without logging in
  if (!userId && !isPublicRoute(req)) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }
     // User is authenticated and user doesnt have org and the link is not select-orgpath
  if(userId && !orgId && req.nextUrl.pathname !== "/select-org"){
    const orgSelection = new URL ("/select-org", req.url);
    return NextResponse.redirect(orgSelection.href);
  }
  // Authenticated user accessing public route
  if(userId && isPublicRoute(req)){
    let path = '/select-org';

    if(orgId){
      path = `/organization/${auth().orgId}`;
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection.href);
  }
  
  // Continue to the next middleware or route handler if no conditions are met
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};