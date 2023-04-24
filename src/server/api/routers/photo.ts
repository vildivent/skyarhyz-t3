import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  ZPhotoCreate,
  ZPhotoUpdatePublic,
  ZPhotoUpdate,
  ZPhotoGet,
  ZDelete,
} from "~/utils/zodSchemas";
import { deleteFile } from "~/utils/fileApi";

export const photoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(ZPhotoCreate)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.photo.create({
        data: {
          title: input.title,
          description: input.description,
          category: input.category,
          image: { create: input.image },
        },
        include: { image: true },
      });
    }),

  update: protectedProcedure
    .input(ZPhotoUpdate)
    .mutation(async ({ ctx, input }) => {
      let imageProp;

      if (input.image) {
        imageProp = {
          image: {
            delete: true,
            create: input.image ? input.image : undefined,
          },
        };

        const photo = await ctx.prisma.photo.findUnique({
          where: { id: input.id },
          include: { image: true },
        });
        await deleteFile(photo?.image?.url);
      }

      return await ctx.prisma.photo.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          category: input.category,
          ...imageProp,
        },
        include: { image: true },
      });
    }),

  updatePublic: publicProcedure
    .input(ZPhotoUpdatePublic)
    .mutation(async ({ ctx, input }) => {
      if (!input.viewsInc) return;

      return await ctx.prisma.photo.update({
        where: { id: input.id },
        data: { views: { increment: 1 } },
        include: { image: true },
      });
    }),

  delete: protectedProcedure.input(ZDelete).mutation(async ({ ctx, input }) => {
    const photo = await ctx.prisma.photo.delete({
      where: { id: input.id },
      include: { image: true },
    });

    await deleteFile(photo?.image?.url);
    await ctx.prisma.image.delete({
      where: { id: photo.imageId || undefined },
    });

    return photo;
  }),

  get: publicProcedure.input(ZPhotoGet).query(async ({ ctx, input }) => {
    return await ctx.prisma.photo.findMany({
      where: {
        OR: [
          { title: { contains: input?.q ?? "", mode: "insensitive" } },
          { description: { contains: input?.q ?? "", mode: "insensitive" } },
        ],
        category: input.category,
      },
      orderBy: { createdAt: "desc" },
      include: { image: true },
    });
  }),
});
