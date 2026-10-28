export const complaintStatuses = [
  "Submitted",
  "In Progress",
  "Resolved",
] as const;

export type ComplaintStatus =
  (typeof complaintStatuses)[number];

export interface Complaint {
  complaintId: number;
  userId: number;
  route: string;
  title: string;
  description?: string;
  status: string;
  archived: boolean;

}

export interface CreateComplaint {
  userId: number;
  route: string;
  title: string;
  description?: string;
  status: string;
}