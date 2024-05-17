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


export const PostZodSchema = z.object({
    title: z.string({required_error: "Title cannot be empty"})
    .min(10, {message: "Title must be at least 10 characters"})
    .max(150, {message: "Title is too long, Max is 150 characters"}),

    description: z.string({required_error: "Description cannot be empty"})
    .min(10, {message: "Description must be at least 10 characters"})
    .max(255, {message: "Description is too long, Max is 255 characters"}),
    
    content: z.string({required_error: "Content cannot be empty"})
    .min(10, {message: "Content must be at least 10 characters"}),
    
    photo: z.string({required_error: "Photo url cannot be empty"})
    .min(2, {message: "Photo url must be provided"})

})