import MailChecker from "mailchecker";
import { z } from "zod";

export const authSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address")
		.refine((email) => MailChecker.isValid(email), {
			message: "Disposable emails are not allowed",
		}),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = authSchema.extend({
	name: z
		.string()
		.min(1, "Name is required")
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be less than 50 characters"),
});

export type AuthFormData = z.infer<typeof authSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
