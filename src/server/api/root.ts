
import { repositoryRouter } from "./routes/repository";
import { createCallerFactory , createTRPCContext , createTRPCRouter , publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
    health : publicProcedure.query( ()=> {
        return {status : "ok" , timeStamps : Date.now()};
    }),
    repository : repositoryRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);