import { z } from "zod";

export const uploadInitSchema = z.object({
  filename: z
    .string()
    .trim()
    .min(1)
    .max(255),

  size: z
    .number()
    .int()
    .positive(),

  mimeType: z
    .string()
    .trim()
    .min(1)
    .max(255),
});

export type UploadInitInput = z.infer<typeof uploadInitSchema>;