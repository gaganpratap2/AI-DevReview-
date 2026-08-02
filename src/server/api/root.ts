import { repositoryRouter } from "./routes/repository";
import { pullRequestRouter } from "./routes/pull-request";
import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "./trpc";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({
    status: "ok",
    timeStamps: Date.now(),
  })),

  repository: repositoryRouter,
  pullRequest: pullRequestRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);















// import { repositoryRouter } from "./routes/repository";
// import { createCallerFactory , createTRPCContext , createTRPCRouter , publicProcedure } from "./trpc";

// export const appRouter = createTRPCRouter({
//     health : publicProcedure.query( ()=> {
//         return {status : "ok" , timeStamps : Date.now()};
//     }),
//     repository : repositoryRouter,
// });

// export type AppRouter = typeof appRouter;

// export const createCaller = createCallerFactory(appRouter);