import type {
  ComplaintUpdate,
  CreateComplaintUpdate,
} from "../types/complaintUpdate";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const listeners = new Set<() => void>();

function notifyChanges() {
  listeners.forEach((listener) => listener());
}

export const complaintUpdateRepository = {

  // Subscribing to repository changes.
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  // Retrieving complaint updates from the backend.
  async getForUser(
    userId: number
  ): Promise<ComplaintUpdate[]> {

    const response = await fetch(
      `${API_BASE_URL}/api/v1/complaint-updates?userId=${userId}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to retrieve complaint updates."
      );
    }

    return response.json();
  },

  // Creating administrator feedback.
  async create(
    input: CreateComplaintUpdate
  ): Promise<ComplaintUpdate> {

    const response = await fetch(
      `${API_BASE_URL}/api/v1/complaint-updates`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(
        () => null
      );

      throw new Error(
        error?.errors?.join(" ") ||
        error?.message ||
        "Failed to create complaint update."
      );
    }

    const update: ComplaintUpdate =
      await response.json();

    notifyChanges();

    return update;
  },
};
