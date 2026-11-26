import type {CreateComplaint} from "../types/complaint";
import { complaintRepository } from "../repositories/complaintRepository";
// Abdel: Importing the complaintUpdateRepository to allow my complaint page to refresh when 
// a complaint is updated or feedback is added.
import {
  complaintUpdateRepository,
} from "../repositories/complaintUpdateRepository";

// Validate the user ID.
function validateUserId(userId: number) {
  if (!Number.isInteger(userId) || userId < 1) {
    throw new Error("Invalid user ID.");
  }
}

export const complaintService = {
  // Abdel: Allowing my complaint page to refresh when a complaint is updated or feedback is added.
  subscribe(listener: () => void) {
    const unsubscribeComplaints =
      complaintRepository.subscribe(listener);

    const unsubscribeUpdates =
      complaintUpdateRepository.subscribe(listener);

    return () => {
      unsubscribeComplaints();
      unsubscribeUpdates();
    };
  },

  // Retrieving complaints belonging to a specific user.
  async getForUser(userId: number) {
    validateUserId(userId);
    return complaintRepository.getForUser(userId);
  },

  // Creates Complaints 
  async create(input: CreateComplaint) {
    validateUserId(input.userId);
    if (!input.title.trim()) throw new Error("Title is required.");
    if (!input.description?.trim()) throw new Error("Description is required.");
    if (!Number.isInteger(input.routeId) || input.routeId < 1)
      throw new Error("Please select an available bus route.");
    return complaintRepository.create({
      ...input,
      title: input.title.trim(),
      description: input.description.trim(),
    });
  },

  // Archives Complaint
  async setArchived(complaintId: number, userId: number, archived: boolean) {
    validateUserId(userId);
    return complaintRepository.setArchived(complaintId, userId, archived);
  },

  // Delete/Cancel Complaint
  async cancelByComplaintId(complaintId: number, userId: number) {
    validateUserId(userId);
    return complaintRepository.delete(complaintId, userId);
  },
};