import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ["/search", '/api/webhook', '/api/uploadthing'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
