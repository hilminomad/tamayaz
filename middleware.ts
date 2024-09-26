import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes:  ["/", "/blog" , "/api/webhook", "/api/uploadthing", "/api/uploads","/api/webhooks/clerk", "/faq", "/terms-and-conditions", "/api/upload"], // Add routes that should be public
  ignoredRoutes: ["/((?!api|trpc))(_next.*|.+.[w]+$)"]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
