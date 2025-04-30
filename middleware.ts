import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const protectedRoute = createRouteMatcher([
  '/profile',
  '/courses/1',
  '/courses/1/prilim',
  '/courses/1/prilim/learn',
  '/courses/1/prilim/learn/assessment',
]);

export default clerkMiddleware(async (auth, req) => {
  if (protectedRoute(req)) {
    const authObject = await auth();
    if (!authObject.userId) {
      return authObject.redirectToSignIn();
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};