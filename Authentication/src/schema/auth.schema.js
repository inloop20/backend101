import {z} from "zod"

export const registrationSchema = z.object({
    username: z.string().min(1,'username is required').transform(s=> s.trim()),
    email: z.string().email("invalid email format"),
    password: z.string().min(6,'password length should not be below 6').transform(s => s.toLowerCase().trim())
});

export const loginSchema = z.object({
    username:z.string().min(1,"username is required").transform(s => s.trim()).optional(),
    email:z.string().email('invalid email format').optional(),
    password: z.string().min(1,"password required").transform(s=> s.toLowerCase().trim()),
}).refine(data => data.email || data.username,{
    message: "Either email or username is required"
});