
import { z } from "zod";

// Convert positive whole number string into number.
const positiveIdFromString = (message: string) =>
  z.string().regex(/^[1-9]\d*$/, message)
    .transform(Number)
    .pipe(z.number().int().positive());

// Validate the creation of a complaint.
export const createComplaintSchema = z.object({
  userId: z.number().int().positive(),

  routeId: z.number().int().positive(),

  title: z.string().trim().min(1, "Title is required."),

  description: z.string().trim().min(1, "Description is required."),
});

// Validate archiving or restoring a complaint.
export const archiveComplaintSchema = z.object({
  userId: z.number().int().positive(),

  archived: z.boolean(),
});

// Validate the user ID from the query string.
export const complaintQuerySchema = z.object({
  userId: positiveIdFromString("User ID must be a positive integer."),
});

// Validate the complaint ID from the URL.
export const complaintParamsSchema = z.object({
  id: positiveIdFromString("Complaint ID must be a positive integer."),
});

// Generate TypeScript types from the schemas.
export type CreateComplaint = z.infer<typeof createComplaintSchema>;

export type ArchiveComplaint = z.infer<typeof archiveComplaintSchema>;

export type ComplaintQuery = z.infer<typeof complaintQuerySchema>;
