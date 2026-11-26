import type { BusRoute } from "../types/busRoutes";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/bus-routes`;

const listeners = new Set<() => void>();


function notifyChanges() {
  listeners.forEach((listener) => listener());
}

export const busRouteRepository = {
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
// Get all bus routes
  async getAll(): Promise<BusRoute[]> {
    const response = await fetch(`${API_URL}`);

    if (!response.ok) {
      throw new Error("Failed to fetch bus routes.");
    }

return response.json();
  },



// Get a bus route by its ID
  async getById(
    id: number
  ): Promise<BusRoute | null> {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch bus route.");
    }

    return response.json();
  },

// Create a new bus route
  async create(
    input: Omit<BusRoute, "id">
  ): Promise<BusRoute> {
    const { schedule, ...rest } = input;
    const body = { ...rest, ...schedule };
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to create bus route.");
    }

    notifyChanges();

    return response.json();
  },


// Update an existing bus route
  async update(
    id: number,
    input: Omit<BusRoute, "id">
  ): Promise<BusRoute> {
    const { schedule, ...rest } = input;
    const body = { ...rest, ...schedule };

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to update bus route.");
    }

    notifyChanges();

    return response.json();
  },

// Delete a bus route by its ID
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete bus route.");
    }

    notifyChanges();

    return;
  },
};