import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "./routers/post";
import { reviewRouter } from "./routers/review";
import { photoRouter } from "./routers/photo";
import { requestRouter } from "./routers/request";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  review: reviewRouter,
  photo: photoRouter,
  request: requestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
