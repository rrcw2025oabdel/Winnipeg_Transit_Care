import {
  complaintStatuses,
  type Complaint,
  type ComplaintStatus,
  type CreateComplaint,
} from "../types/complaint";

import { complaintRepository } from "../repositories/complaintRepository";

import { busRouteService } from "./busRouteService";

// Validate the user ID
function validateUserId(userId: number) {
  if (
    !Number.isInteger(userId) ||
    userId < 1
  ) {
    throw new Error(
      "Invalid user ID."
    );
  }
}

// Get a complaint by its ID and validate ownership
async function getOwnedComplaint(
  complaintId: number,
  userId: number
): Promise<Complaint> {
  validateUserId(userId);

  const complaint =
    await complaintRepository
      .getByComplaintId(complaintId);

  if (
    !complaint ||
    complaint.userId !== userId
  ) {
    throw new Error(
      "Complaint not found for this user."
    );
  }

  return complaint;
}

// Complaint service
export const complaintService = {
  subscribe(listener: () => void) {
    return complaintRepository.subscribe(
      listener
    );
  },

  async getForUser(
    userId: number
  ): Promise<Complaint[]> {
    validateUserId(userId);

    const complaints =
      await complaintRepository.getAll();

    return complaints.filter(
      (complaint) =>
        complaint.userId === userId
    );
  },
  // Create a new complaint
  async create(
    input: CreateComplaint
  ): Promise<Complaint> {
    validateUserId(input.userId);

    if (!input.title.trim()) {
      throw new Error(
        "Title is required."
      );
    }

    if (!input.description?.trim()) {
      throw new Error(
        "Description is required."
      );
    }

    const routes =
      await busRouteService.getAll();

    const validRoute = routes.some(
      (route) =>
        `${route.routeNumber} - ${route.routeName}` ===
        input.route
    );

    if (!validRoute) {
      throw new Error(
        "Please select an available bus route."
      );
    }

    return complaintRepository.create({
      userId: input.userId,
      route: input.route,
      title: input.title.trim(),
      description:
        input.description.trim(),
      status: "Submitted",
    });
  },

  // Set the archived status of a complaint
  async setArchived(
    complaintId: number,
    userId: number,
    archived: boolean
  ): Promise<Complaint> {
    await getOwnedComplaint(
      complaintId,
      userId
    );

    return complaintRepository.update(
      complaintId,
      { archived }
    );
  },

  // Cancel a complaint by its ID
  async cancelByComplaintId(
    complaintId: number,
    userId: number
  ): Promise<void> {
    await getOwnedComplaint(
      complaintId,
      userId
    );

    const removed =
      await complaintRepository.delete(
        complaintId
      );

    if (!removed) {
      throw new Error(
        "Complaint not found."
      );
    }
  },

  
  // Update the status of a complaint
  async updateStatus(
    complaintId: number,
    status: string,
    adminNote: string
  ): Promise<Complaint> {
    const complaint =
      await complaintRepository
        .getByComplaintId(complaintId);

    if (!complaint) {
      throw new Error(
        "Please select an existing complaint."
      );
    }

    if (
      !complaintStatuses.includes(
        status as ComplaintStatus
      )
    ) {
      throw new Error(
        "Please select a valid status."
      );
    }

    if (
      adminNote.trim().length < 5
    ) {
      throw new Error(
        "Admin note must contain at least 5 characters."
      );
    }

    return complaintRepository.update(
      complaintId,
      {
        status:
          status as ComplaintStatus,
        latestAdminNote:
          adminNote.trim(),
      }
    );
  },
};