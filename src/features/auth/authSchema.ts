import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Provide a valid email address" })
    .min(1, { message: "Email must not be empty" })
    .max(50, { message: "Email must be less than 50 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const SignupFormSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms." }),
  }),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export type SignupFormType = z.infer<typeof SignupFormSchema>;
