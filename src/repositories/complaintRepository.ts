import { listedComplaints } from "../data/complaints";

import type {
  Complaint,
  CreateComplaint,
} from "../types/complaint";

let complaints: Complaint[] =
  structuredClone(listedComplaints);

let nextId =
  Math.max(
    0,
    ...complaints.map(
      (complaint) => complaint.complaintId
    )
  ) + 1;

const listeners = new Set<() => void>();

function notifyChanges() {
  listeners.forEach((listener) => listener());
}

export const complaintRepository = {
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
// Get all complaints
  async getAll(): Promise<Complaint[]> {
    return structuredClone(complaints);
  },
// Get a complaint by its ID
  async getByComplaintId(
    complaintId: number
  ): Promise<Complaint | null> {
    const complaint = complaints.find(
      (item) =>
        item.complaintId === complaintId
    );

    return complaint
      ? structuredClone(complaint)
      : null;
  },

  // Create a new complaint
  async create(
    input: CreateComplaint & {
      status: Complaint["status"];
    }
  ): Promise<Complaint> {
    const complaint: Complaint = {
      ...input,
      complaintId: nextId++,
      archived: false,
    };

    complaints = [
      ...complaints,
      complaint,
    ];

    notifyChanges();

    return structuredClone(complaint);
  },
// Update an existing complaint
  async update(
    complaintId: number,
    changes: Partial<
      Omit<Complaint, "complaintId">
    >
  ): Promise<Complaint> {
    const existing = complaints.find(
      (item) =>
        item.complaintId === complaintId
    );

    if (!existing) {
      throw new Error(
        "Complaint not found."
      );
    }

    const updated: Complaint = {
      ...existing,
      ...changes,
      complaintId,
    };

    complaints = complaints.map(
      (item) =>
        item.complaintId === complaintId
          ? updated
          : item
    );

    notifyChanges();

    return structuredClone(updated);
  },
// Delete a complaint by its ID
  async delete(
    complaintId: number
  ): Promise<boolean> {
    const originalLength =
      complaints.length;

    complaints = complaints.filter(
      (item) =>
        item.complaintId !== complaintId
    );

    const removed =
      complaints.length < originalLength;

    if (removed) {
      notifyChanges();
    }

    return removed;
  },
};