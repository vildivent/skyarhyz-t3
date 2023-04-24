import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { deleteFile } from "~/utils/fileApi";

const Zimage = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  url: z.string().url().min(1),
  aspectRatio: z.number().positive(),
});

const createInput = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  srcUrl: z.string().url().optional(),
  image: Zimage.optional(),
});

const updateInput = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  text: z.string().optional(),
  srcUrl: z.string().url().nullish(),
  image: Zimage.nullish(),
  viewsInc: z.boolean().optional(),
});

const getInput = z.string().nullish();

const deleteInput = z.string();

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createInput)
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
    .input(updateInput)
    .mutation(async ({ ctx, input }) => {
      let imageProp;
      let viewsProp;

      if (input.viewsInc) viewsProp = { views: { increment: 1 } };

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
          ...viewsProp,
          ...imageProp,
        },
        include: { image: true },
      });
    }),

  delete: protectedProcedure
    .input(deleteInput)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.delete({
        where: { id: input },
        include: { image: true },
      });

      await deleteFile(post?.image?.url);
      await ctx.prisma.image.delete({
        where: { id: post.imageId || undefined },
      });

      return post;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { image: true },
    });
  }),

  get: publicProcedure.input(getInput).query(async ({ ctx, input }) => {
    return await ctx.prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: input || "", mode: "insensitive" } },
          { text: { contains: input || "", mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { image: true },
    });
  }),
});
