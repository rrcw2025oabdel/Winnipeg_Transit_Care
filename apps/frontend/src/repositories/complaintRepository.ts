import type { Complaint, CreateComplaint } from "../types/complaint";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/complaints`;

const listeners = new Set<() => void>();
function notifyChanges() {
  listeners.forEach((listener) => listener());
}

async function readError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  return new Error(body?.errors?.join(" ") || body?.message || fallback);
}

export const complaintRepository = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },

  async getForUser(userId: number): Promise<Complaint[]> {
    const response = await fetch(`${BASE_URL}?userId=${userId}`);
    if (!response.ok) throw await readError(response, "Failed to retrieve complaints.");
    return response.json();
  },

  async create(input: CreateComplaint): Promise<Complaint> {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw await readError(response, "Failed to create complaint.");
    const complaint: Complaint = await response.json();
    notifyChanges();
    return complaint;
  },

  async setArchived(complaintId: number, userId: number, archived: boolean): Promise<Complaint> {
    const response = await fetch(`${BASE_URL}/${complaintId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, archived }),
    });
    if (!response.ok) throw await readError(response, "Failed to update complaint.");
    const complaint: Complaint = await response.json();
    notifyChanges();
    return complaint;
  },

  async delete(complaintId: number, userId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${complaintId}?userId=${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw await readError(response, "Failed to cancel complaint.");
    notifyChanges(); // 204: no body
  },
};