
import { z } from "zod";

// Valid complaint statuses.
export const complaintStatuses = [
  "Submitted",
  "In Progress",
  "Resolved",
] as const;

// Validate the creation of a complaint update.
export const complaintUpdateSchema = z.object({
  complaintId: z.number().int().positive(),

  status: z.enum(complaintStatuses),

  adminNote: z.string().trim().min(
    5,
    "Admin note must contain at least 5 characters."
  ),
});

// Validate the user ID from the query string.
export const complaintUpdateQuerySchema = z.object({
  userId: z.string().regex(/^[1-9]\d*$/)
    .transform(Number)
    .pipe(z.number().int().positive()),
});

// Generate TypeScript types from the schemas.
export type CreateComplaintUpdate = z.infer<
  typeof complaintUpdateSchema
>;

export type ComplaintUpdateQuery = z.infer<
  typeof complaintUpdateQuerySchema
>;
