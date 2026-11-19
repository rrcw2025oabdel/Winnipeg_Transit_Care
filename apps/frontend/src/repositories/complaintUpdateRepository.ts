import type {
  ComplaintUpdate,
  CreateComplaintUpdate,
} from "../types/complaintUpdate";

// Importing the initial fixtures for complaint updates
import { complaintUpdateTestData } from "../data/complaintUpdates";

// Creating a local copy of the complaint updates data to work with
let updates =
  structuredClone(complaintUpdateTestData);

let nextId =
  Math.max(
    0,
    ...updates.map((update) => update.id)
  ) + 1;

const listeners = new Set<() => void>();

function notifyChanges() {
  listeners.forEach((listener) => listener());
}

/**
 * This function handles data access for complaint-update records. 
 * It imports the initial fixtures and provides CRUD methods for 
 * managing complaint updates.
 */
export const complaintUpdateRepository = {
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
  // Get all complaint updates
  async getAll(): Promise<ComplaintUpdate[]> {
    return structuredClone(updates);
  },

  // Get a complaint update by its ID
  async getById(
    id: number
  ): Promise<ComplaintUpdate | null> {
    const update = updates.find(
      (item) => item.id === id
    );

    return update
      ? structuredClone(update)
      : null;
  },

  // Create a new complaint update
  async create(
    input: CreateComplaintUpdate
  ): Promise<ComplaintUpdate> {
    const update: ComplaintUpdate = {
      ...input,
      id: nextId++,
    };

    updates = [...updates, update];

    notifyChanges();

    return structuredClone(update);
  },
 // Update an existing complaint update
  async update(
    id: number,
    adminNote: string
  ): Promise<ComplaintUpdate> {
    const existing = updates.find(
      (item) => item.id === id
    );

    if (!existing) {
      throw new Error(
        "Complaint update not found."
      );
    }

    const updated: ComplaintUpdate = {
      ...existing,
      adminNote,
    };

    updates = updates.map((item) =>
      item.id === id ? updated : item
    );

    notifyChanges();

    return structuredClone(updated);
  },
  // Delete a complaint update by its ID
  async delete(id: number): Promise<boolean> {
    const originalLength = updates.length;

    updates = updates.filter(
      (item) => item.id !== id
    );

    const removed =
      updates.length < originalLength;

    if (removed) {
      notifyChanges();
    }

    return removed;
  },
};