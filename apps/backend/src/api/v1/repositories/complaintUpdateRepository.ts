
import type {
  ComplaintStatus,
  CreateComplaintUpdate,
} from "../validations/complaintUpdateSchema";

interface Complaint {
  complaintId: number;
  userId: number;
  status: ComplaintStatus;
}

interface ComplaintUpdate {
  id: number;
  complaintId: number;
  status: ComplaintStatus;
  adminNote: string;
}

// Temporary complaints for backend testing waiting for aubery and keith to complete the database schema.
const complaints: Complaint[] = [
  {
    complaintId: 1,
    userId: 1,
    status: "Submitted",
  },
  {
    complaintId: 2,
    userId: 1,
    status: "In Progress",
  },
  {
    complaintId: 3,
    userId: 2,
    status: "Submitted",
  },
];

// Temporary complaint update history.
const complaintUpdates: ComplaintUpdate[] = [
  {
    id: 1,
    complaintId: 2,
    status: "In Progress",
    adminNote: "The complaint is being investigated.",
  },
];

let nextId = 2;

export const complaintUpdateRepository = {

  // Finding a complaint by its ID.
  findComplaint(complaintId: number) {
    return complaints.find(
      (complaint) =>
        complaint.complaintId === complaintId
    );
  },

  // Retrieving complaint updates for a specific user.
  getForUser(userId: number) {
    const complaintIds = complaints
      .filter(
        (complaint) => complaint.userId === userId
      )
      .map(
        (complaint) => complaint.complaintId
      );

    return complaintUpdates
      .filter((update) =>
        complaintIds.includes(update.complaintId)
      )
      .sort((a, b) => b.id - a.id);
  },

  // Updating the complaint status.
  updateComplaintStatus(
    complaintId: number,
    status: ComplaintStatus
  ) {
    const complaint = this.findComplaint(complaintId);

    if (complaint) {
      complaint.status = status;
    }
  },

  // Creating a complaint update.
  create(data: CreateComplaintUpdate) {
    const update: ComplaintUpdate = {
      id: nextId++,
      complaintId: data.complaintId,
      status: data.status,
      adminNote: data.adminNote.trim(),
    };

    complaintUpdates.push(update);

    return update;
  },
};
