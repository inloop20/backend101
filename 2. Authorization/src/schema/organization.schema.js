import { z } from "zod";

export const orgCreateSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
});

export const AddUserBodySchema = z.object({
  userId: z.uuid("Invalid user ID"),
});


export const UpdateMemberRoleSchema = z.object({
  role: z.enum(["admin", "editor", "member"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role",
  }),
});