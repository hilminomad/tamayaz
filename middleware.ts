import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ["/",'/blog' ,'/api/webhook', '/api/uploadthing'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
