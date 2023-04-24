import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  ZReviewCreate,
  ZReviewUpdate,
  ZReviewUpdatePublic,
  ZReviewGet,
  ZDelete,
} from "~/utils/zodSchemas";
import { deleteFile } from "~/utils/fileApi";

export const reviewRouter = createTRPCRouter({
  create: publicProcedure
    .input(ZReviewCreate)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.review.create({
        data: {
          name: input.name,
          text: input.text,
          stars: input.stars,
          avatar: { create: input.avatar },
          attachment: { create: input.attachment },
        },
        include: { avatar: true, attachment: true },
      });
    }),

  update: protectedProcedure
    .input(ZReviewUpdate)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.review.update({
        where: { id: input.id },
        data: {
          status: input.status,
        },
        include: { avatar: true, attachment: true },
      });
    }),

  updatePublic: publicProcedure
    .input(ZReviewUpdatePublic)
    .mutation(async ({ ctx, input }) => {
      let viewsProp;
      let upvotesProp;
      let downvotesProp;

      if (input.viewsInc) viewsProp = { views: { increment: 1 } };
      if (input.upvotesInc) upvotesProp = { upvotes: { increment: 1 } };
      if (input.downvotesInc) downvotesProp = { downvotes: { increment: 1 } };

      return await ctx.prisma.review.update({
        where: { id: input.id },
        data: {
          ...viewsProp,
          ...upvotesProp,
          ...downvotesProp,
        },
        include: { avatar: true, attachment: true },
      });
    }),

  delete: protectedProcedure.input(ZDelete).mutation(async ({ ctx, input }) => {
    const review = await ctx.prisma.review.delete({
      where: { id: input.id },
      include: { avatar: true, attachment: true },
    });

    await deleteFile(review?.avatar?.url);
    await deleteFile(review?.attachment?.url);

    await ctx.prisma.image.deleteMany({
      where: {
        OR: [
          { id: review.avatarId || undefined },
          { id: review.attachmentId || undefined },
        ],
      },
    });

    return review;
  }),

  get: publicProcedure.input(ZReviewGet).query(async ({ ctx, input }) => {
    return await ctx.prisma.review.findMany({
      where: {
        OR: [
          { name: { contains: input.q ?? "", mode: "insensitive" } },
          { text: { contains: input.q ?? "", mode: "insensitive" } },
        ],
        status: input.status,
      },
      orderBy: { createdAt: "desc" },
      include: { avatar: true, attachment: true },
    });
  }),
});
