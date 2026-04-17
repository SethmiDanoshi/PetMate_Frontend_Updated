import { z } from "zod";

export const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(1, "Name is required"),
    role: z.enum(["SELLER", "BUYER", "OWNER"], {
        errorMap: () => ({ message: "Role is required" }),
    }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    termsAccepted: z.literal(true, {
        errorMap: () => ({ message: "You must accept the terms" }),
    }),
    mobileNumber: z.string().min(10, "Invalid mobile number")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
})