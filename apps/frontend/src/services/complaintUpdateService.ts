import {
  complaintStatuses,
  type ComplaintStatus,
} from "../types/complaint";

import type {
  ComplaintUpdate,
} from "../types/complaintUpdate";

import {
  complaintRepository,
} from "../repositories/complaintRepository";

import {
  complaintUpdateRepository,
} from "../repositories/complaintUpdateRepository";

export const complaintUpdateService = {

  // Subscribing to complaint and feedback changes.
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

  // Retrieving feedback for a specific user.
  async getForUser(
    userId: number
  ): Promise<ComplaintUpdate[]> {

    if (!Number.isInteger(userId) || userId < 1) {
      throw new Error("Invalid user ID.");
    }

    return complaintUpdateRepository.getForUser(userId);
  },

  // Validating and submitting administrator feedback.
  async create(
    complaintId: number,
    status: string,
    adminNote: string
  ): Promise<ComplaintUpdate> {

    if (
      !Number.isInteger(complaintId) ||
      complaintId < 1
    ) {
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

    return complaintUpdateRepository.create({
      complaintId,
      status: status as ComplaintStatus,
      adminNote: adminNote.trim(),
    });
  },
};
