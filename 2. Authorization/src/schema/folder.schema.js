import { z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(100),

  parentFolderId: z
  .uuid("Invalid folder id")
  .optional()
  .nullable()
  .transform((val) => val ?? null),
}).strict()

export const updateFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(100),
});


