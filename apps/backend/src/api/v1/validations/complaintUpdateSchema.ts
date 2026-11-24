
export type ComplaintStatus =
  | "Submitted"
  | "In Progress"
  | "Resolved";

export interface CreateComplaintUpdate {
  complaintId: number;
  status: ComplaintStatus;
  adminNote: string;
}

// Validate the complaint update request body.
export const complaintUpdateSchema = (
  body: unknown
): string[] => {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    return ["Request body is required."];
  }

  const data = body as Record<string, unknown>;

  // Validate the complaint ID.
  if (
    typeof data.complaintId !== "number" ||
    !Number.isInteger(data.complaintId) ||
    data.complaintId <= 0
  ) {
    errors.push("A valid complaint ID is required.");
  }

  // Validate the complaint status.
  const validStatuses = [
    "Submitted",
    "In Progress",
    "Resolved",
  ];

  if (
    typeof data.status !== "string" ||
    !validStatuses.includes(data.status)
  ) {
    errors.push("Invalid complaint status.");
  }

  // Validate the administrator note.
  if (
    typeof data.adminNote !== "string" ||
    data.adminNote.trim().length < 5
  ) {
    errors.push(
      "Admin note must contain at least 5 characters."
    );
  }

  return errors;
};
