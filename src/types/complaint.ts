export interface Complaint {
  complaintId: number;
  userId: number;
  route: string;
  title: string;
  description?: string;
  status: string;
}

export interface CreateComplaint {
  userId: number;
  route: string;
  title: string;
  description?: string;
  status: string;
}