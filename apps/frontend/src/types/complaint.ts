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
  routeId: number;
  route: string;
  title: string;
  description?: string;
  status: string;
  archived: boolean;
  createdAt: string;
}

export interface CreateComplaint {
  userId: number;
  routeId: number;
  title: string;
  description?: string;
}