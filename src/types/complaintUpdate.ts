import type { ComplaintStatus } from "./complaint";

export interface ComplaintUpdate {
  id: number;
  complaintId: number;
  status: ComplaintStatus;
  adminNote: string;
}

export type CreateComplaintUpdate =
  Omit<ComplaintUpdate, "id">;