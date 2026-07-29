import {betterAuth} from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../db";
import { tr } from "zod/v4/locales";

export const auth = betterAuth({
      database: prismaAdapter(db, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled : true
    },
    socialProviders: {
        github : {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },

    session : {
        expiresIn:60 * 60 *24 * 7,
        upadateAge:60 * 60 * 24,
        cookieCache:{
            enabled : true,
            maxAge: 60 * 5,
        },
    },

    trustedOrigins: [process.env.BETTER_AUTH_URL!],
});  

export type Session = typeof auth.$Infer.Session;