import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  ZRequestCreate,
  ZRequestUpdate,
  ZRequestGet,
  ZDelete,
} from "~/utils/zodSchemas";

export const requestRouter = createTRPCRouter({
  create: protectedProcedure
    .input(ZRequestCreate)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.request.create({ data: input });
    }),

  update: protectedProcedure
    .input(ZRequestUpdate)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.request.update({
        where: { id: input.id },
        data: {
          dates: input.dates,
          description: input.description,
          excursionDate: input.excursionDate,
          groupNumber: input.groupNumber,
          groupSize: input.groupSize,
          referral: input.referral,
          status: input.status,
        },
      });
    }),

  delete: protectedProcedure.input(ZDelete).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.request.delete({
      where: { id: input.id },
    });
  }),

  get: publicProcedure.input(ZRequestGet).query(async ({ ctx, input }) => {
    const requests = await ctx.prisma.request.findMany({
      where: {
        OR: [
          { name: { contains: input.q, mode: "insensitive" } },
          { description: { contains: input.q, mode: "insensitive" } },
          { comment: { contains: input.q, mode: "insensitive" } },
        ],
        status: input.status,
        referral: input.referral,
        excursionDate: input.excursionDate,
        groupNumber: input.groupNumber,
      },
      orderBy: { createdAt: "desc" },
    });
    return requests.filter((request) => {
      const startDate = request.dates[0];
      const endDate = request.dates[1];
      const filter = input.date;

      if (!filter) return true;
      if (!startDate || !endDate) return false;

      if (startDate > filter) return false;
      if (endDate < filter) return false;

      return true;
    });
  }),
});
