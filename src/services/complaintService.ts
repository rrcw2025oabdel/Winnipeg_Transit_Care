import type {
  Complaint,
  CreateComplaint,
} from "../types/complaint";

import { complaintRepository } from "../repositories/complaintRepository";
import { busRouteService } from "./busRouteService";

// Validate the user ID.
function validateUserId(userId: number) {
  if (!Number.isInteger(userId) || userId < 1) {
    throw new Error("Invalid user ID.");
  }
}

// Retrieve a complaint and validate ownership.
async function getOwnedComplaint(
  complaintId: number,
  userId: number
): Promise<Complaint> {
  validateUserId(userId);

  const complaint =
    await complaintRepository.getByComplaintId(complaintId);

  if (!complaint || complaint.userId !== userId) {
    throw new Error("Complaint not found for this user.");
  }

  return complaint;
}

export const complaintService = {
  subscribe(listener: () => void) {
    return complaintRepository.subscribe(listener);
  },

  async getForUser(userId: number): Promise<Complaint[]> {
    validateUserId(userId);

    const complaints = await complaintRepository.getAll();

    return complaints.filter(
      (complaint) => complaint.userId === userId
    );
  },

  async create(input: CreateComplaint): Promise<Complaint> {
    validateUserId(input.userId);

    if (!input.title.trim()) {
      throw new Error("Title is required.");
    }

    if (!input.description?.trim()) {
      throw new Error("Description is required.");
    }

    const routes = await busRouteService.getAll();

    const validRoute = routes.some(
      (route) =>
        `${route.routeNumber} - ${route.routeName}` === input.route
    );

    if (!validRoute) {
      throw new Error("Please select an available bus route.");
    }

    return complaintRepository.create({
      userId: input.userId,
      route: input.route,
      title: input.title.trim(),
      description: input.description.trim(),
      status: "Submitted",
    });
  },

  async setArchived(
    complaintId: number,
    userId: number,
    archived: boolean
  ): Promise<Complaint> {
    await getOwnedComplaint(complaintId, userId);

    return complaintRepository.update(
      complaintId,
      { archived }
    );
  },

  async cancelByComplaintId(
    complaintId: number,
    userId: number
  ): Promise<void> {
    await getOwnedComplaint(complaintId, userId);

    const removed =
      await complaintRepository.delete(complaintId);

    if (!removed) {
      throw new Error("Complaint not found.");
    }
  },
};