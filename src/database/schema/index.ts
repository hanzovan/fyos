import { strongPassword } from "@/lib/utils";
import { z } from "zod";

export const UserZodSchema = z.object({
    id: z.string({ required_error: "User id must be provided" }).optional(),
    email: z
        .string({ required_error: "Email must be provided" })
        .email("Email must be a valid email address")
        .min(3, { message: "Enter a valid email address" }),
    password: z
        .string({ required_error: "Password must be provided" })
        .refine(strongPassword, "Your password  need to have at least 8 characters including uppercase, number, alphabet, and special character")
});