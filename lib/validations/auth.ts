import { z } from "zod";

export const RegisterStudentSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  role: z.literal("student"),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().regex(/^\+?[0-9]{10,13}$/, "Invalid phone"),
  rollNumber: z.string().min(3),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  dateOfBirth: z.string().optional(),
  branch: z.string().min(2),
  course: z.string().min(2),
  year: z.number().int().min(1).max(6),
  section: z.string().optional(),
  admissionYear: z.number().int().min(2000).max(2030),
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(500).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const RegisterAlumniSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  role: z.literal("alumni"),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().regex(/^\+?[0-9]{10,13}$/).optional(),
  branch: z.string().min(2),
  course: z.string().min(2),
  passingYear: z.number().int().min(2000).max(2030),
  currentCompany: z.string().optional(),
  currentRole: z.string().optional(),
  currentLocation: z.string().optional(),
  skills: z.array(z.string()).default([]),
  domains: z.array(z.string()).default([]),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(1000).optional(),
  isMentor: z.boolean().default(false),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const OTPSchema = z.object({
  userId: z.string().cuid(),
  code: z.string().length(6),
  type: z.enum(["login", "email_verify", "reset_password"]),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
  userId: z.string().cuid(),
  code: z.string().length(6),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export type RegisterStudentInput = z.infer<typeof RegisterStudentSchema>;
export type RegisterAlumniInput = z.infer<typeof RegisterAlumniSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type OTPInput = z.infer<typeof OTPSchema>;
