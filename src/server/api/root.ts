import { repositoryRouter } from "./routes/repository";
import { pullRequestRouter } from "./routes/pull-request";
import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "./trpc";
import { reviewRouter } from "./routes/review";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({
    status: "ok",
    timeStamps: Date.now(),
  })),

  repository: repositoryRouter,
  pullRequest: pullRequestRouter,
  review: reviewRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
