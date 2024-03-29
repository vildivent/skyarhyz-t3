import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  ZPostCreate,
  ZPostUpdatePublic,
  ZPostUpdate,
  ZPostGet,
  ZDelete,
} from "~/utils/zodSchemas";
import { deleteFile } from "~/utils/fileApi";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(ZPostCreate)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: {
          title: input.title,
          text: input.text,
          srcUrl: input.srcUrl,
          image: { create: input.image },
        },
        include: { image: true },
      });
    }),

  update: protectedProcedure
    .input(ZPostUpdate)
    .mutation(async ({ ctx, input }) => {
      let imageProp;

      if (input.image || input.image === null) {
        imageProp = {
          image: {
            delete: true,
            create: input.image ? input.image : undefined,
          },
        };

        const post = await ctx.prisma.post.findUnique({
          where: { id: input.id },
          include: { image: true },
        });
        await deleteFile(post?.image?.url);
      }

      return await ctx.prisma.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          text: input.text,
          srcUrl: input.srcUrl,
          ...imageProp,
        },
        include: { image: true },
      });
    }),

  updatePublic: publicProcedure
    .input(ZPostUpdatePublic)
    .mutation(async ({ ctx, input }) => {
      if (!input.viewsInc) return;

      return await ctx.prisma.post.update({
        where: { id: input.id },
        data: { views: { increment: 1 } },
        include: { image: true },
      });
    }),

  delete: protectedProcedure.input(ZDelete).mutation(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.delete({
      where: { id: input.id },
      include: { image: true },
    });

    await deleteFile(post?.image?.url);
    await ctx.prisma.image.delete({
      where: { id: post.imageId || undefined },
    });

    return post;
  }),

  get: publicProcedure.input(ZPostGet).query(async ({ ctx, input }) => {
    return await ctx.prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: input?.q ?? "", mode: "insensitive" } },
          { text: { contains: input?.q ?? "", mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { image: true },
    });
  }),
});
