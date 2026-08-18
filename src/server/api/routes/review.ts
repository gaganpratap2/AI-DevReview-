import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { inngest } from "@/server/inngest";
import { getGitHubAccessToken } from "@/server/services/github";

export const reviewRouter = createTRPCRouter({
  trigger: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        prNumber: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const repository = await ctx.db.repository.findFirst({
        where: {
          id: input.repositoryId,
          userId: ctx.user.id,
        },
      });

      if (!repository) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Repository not found",
        });
      }

      const accessToken = await getGitHubAccessToken(ctx.user.id);

      if (!accessToken) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "GitHub account not connected",
        });
      }

      const [owner, repo] = repository.fullName.split("/");

      if (!owner || !repo) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid repository name",
        });
      }

      const review = await ctx.db.review.create({
        data: {
          repositoryId: repository.id,
          userId: ctx.user.id,
          prNumber: input.prNumber,
          prTitle: `PR #${input.prNumber}`,
          prUrl: `https://github.com/${repository.fullName}/pull/${input.prNumber}`,
          status: "PENDING",
        },
      });

      try {
        await inngest.send({
          name: "review/pr.requested",
          data: {
            reviewId: review.id,
            repositoryId: repository.id,
            prNumber: input.prNumber,
            userId: ctx.user.id,
          },
        });
      } catch (error) {
        await ctx.db.review.update({
          where: { id: review.id },
          data: { status: "FAILED" },
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to start code review",
          cause: error,
        });
      }

      return {
        reviewId: review.id,
        message: "Code review started successfully",
      };
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const review = await ctx.db.review.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        include: {
          repository: true,
        },
      });

      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      return review;
    }),

  list: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string().optional(),
        limit: z.number().int().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.db.review.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.repositoryId
            ? { repositoryId: input.repositoryId }
            : {}),
        },
        include: {
          repository: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
      });

      return reviews;
    }),

  getLatestForPR: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        prNumber: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const review = await ctx.db.review.findFirst({
        where: {
          repositoryId: input.repositoryId,
          prNumber: input.prNumber,
          userId: ctx.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          repository: true,
        },
      });

      return review;
    }),
});
