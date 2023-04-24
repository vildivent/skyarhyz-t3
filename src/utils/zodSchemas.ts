import { z } from "zod";

export const ZImage = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  url: z.string().url().min(1),
  aspectRatio: z.number().positive(),
});

export const ZDelete = z.object({ id: z.string().min(1) });

//post
export const ZPostCreate = z.object({
  title: z.string().min(1).max(50),
  text: z.string().min(1),
  srcUrl: z.string().url().optional(),
  image: ZImage.optional(),
});

export const ZPostUpdatePublic = z.object({
  id: z.string().min(1),
  viewsInc: z.boolean(),
});

export const ZPostUpdate = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  text: z.string().optional(),
  srcUrl: z.string().url().nullish(),
  image: ZImage.nullish(),
  viewsInc: z.boolean().optional(),
});

export const ZPostGet = z.object({ q: z.string().optional() }).optional();

//review
export const ZReviewCreate = z.object({
  name: z.string().min(1).max(50),
  text: z.string().min(1).max(5000),
  stars: z.number().min(1).max(5),
  avatar: ZImage.optional(),
  attachment: ZImage.optional(),
});

export const ZReviewUpdatePublic = z.object({
  id: z.string().min(1),
  viewsInc: z.boolean().optional(),
  upvotesInc: z.boolean().optional(),
  downvotesInc: z.boolean().optional(),
});

export const ZReviewUpdate = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "registered"]),
});

export const ZReviewGet = z.object({
  q: z.string().optional(),
  status: z.enum(["new", "registered"]).optional(),
});

//photo
export const ZPhotoCreate = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(500),
  category: z.string().min(1).max(50),
  image: ZImage,
});

export const ZPhotoUpdatePublic = z.object({
  id: z.string().min(1),
  viewsInc: z.boolean().optional(),
});

export const ZPhotoUpdate = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(50).optional(),
  description: z.string().min(1).max(500).nullish(),
  category: z.string().min(1).max(50).optional(),
  image: ZImage.optional(),
});

export const ZPhotoGet = z.object({
  q: z.string().optional(),
  category: z.string().min(1).max(50).optional(),
});

//request
export const ZRequestCreate = z.object({
  name: z.string().min(1).max(50),
  phoneNumber: z.string().min(18).max(18),
  groupSize: z.number().min(1).max(99),
  dates: z.array(z.date()).min(2).max(2),
  comment: z.string().min(1).max(500),
  referral: z.string().min(1).max(50).optional(),
});

export const ZRequestUpdate = z.object({
  id: z.string().min(1),
  groupSize: z.number().min(1).max(99).optional(),
  dates: z.array(z.date()).min(2).max(2).optional(),
  status: z.enum(["new", "registered", "active", "fulfilled"]).optional(),
  description: z.string().min(1).max(500).nullish(),
  referral: z.string().min(1).max(50).nullish(),
  excursionDate: z.date().nullish(),
  groupNumber: z.number().positive().nullish(),
});

export const ZRequestGet = z.object({
  q: z.string().min(1).optional(),
  date: z.date().optional(),
  status: z.enum(["new", "registered", "active", "fulfilled"]).optional(),
  referral: z.string().min(1).max(50).nullish(),
  excursionDate: z.date().nullish(),
  groupNumber: z.number().positive().nullish(),
});
