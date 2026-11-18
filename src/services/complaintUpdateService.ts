import {
  complaintStatuses,
  type ComplaintStatus,
} from "../types/complaint";

import type { ComplaintUpdate } from "../types/complaintUpdate";
import { complaintRepository } from "../repositories/complaintRepository";
import { complaintUpdateRepository } from "../repositories/complaintUpdateRepository";

/**
 * This function serves as a service layer for managing complaint updates.
 * It provides methods to retrieve and create complaint updates, ensuring 
 * that the operations are valid and consistent with the underlying data models.
 */
export const complaintUpdateService = {
  subscribe(listener: () => void) {
    const unsubscribeUpdates =
      complaintUpdateRepository.subscribe(listener);

    const unsubscribeComplaints =
      complaintRepository.subscribe(listener);

    return () => {
      unsubscribeUpdates();
      unsubscribeComplaints();
    };
  },
  // Get all complaint updates
  async getForUser(
    userId: number
  ): Promise<ComplaintUpdate[]> {
    if (
      !Number.isInteger(userId) ||
      userId < 1
    ) {
      throw new Error(
        "Invalid user ID."
      );
    }

    // Retrieve all complaints for the user
    const complaints =
      await complaintRepository.getAll();

    const ownedComplaintIds = new Set(
      complaints
        .filter(
          (complaint) =>
            complaint.userId === userId
        )
        .map(
          (complaint) =>
            complaint.complaintId
        )
    );
    // Retrieve all complaint updates and filter them based on the user's complaints
    const updates =
      await complaintUpdateRepository.getAll();

    return updates
      .filter((update) =>
        ownedComplaintIds.has(
          update.complaintId
        )
      )
      .sort(
        (first, second) =>
          second.id - first.id
      );
  },
  // Create a new complaint update
  async create(
    complaintId: number,
    status: string,
    adminNote: string
  ): Promise<ComplaintUpdate> {
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

    if (adminNote.trim().length < 5) {
      throw new Error(
        "Admin note must contain at least 5 characters."
      );
    }

    const validatedStatus =
      status as ComplaintStatus;

    await complaintRepository.update(
      complaintId,
      {
        status: validatedStatus,
      }
    );

    return complaintUpdateRepository.create({
      complaintId,
      status: validatedStatus,
      adminNote: adminNote.trim(),
    });
  },
};