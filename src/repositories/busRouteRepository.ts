import type { BusRoute } from "../types/busRoutes";

import { SampleBusRoutes } from "../data/busRoutes.testdata";

let routes: BusRoute[] =
  structuredClone(SampleBusRoutes);

let nextId =
  Math.max(
    0,
    ...routes.map((route) => route.id)
  ) + 1;

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
    return structuredClone(routes);
  },

  // Get a bus route by its ID
  async getById(
    id: number
  ): Promise<BusRoute | null> {
    const route = routes.find(
      (item) => item.id === id
    );

    return route
      ? structuredClone(route)
      : null;
  },
// Create a new bus route
  async create(
    input: Omit<BusRoute, "id">
  ): Promise<BusRoute> {
    const route: BusRoute = {
      ...input,
      id: nextId++,
    };

    routes = [...routes, route];

    notifyChanges();

    return structuredClone(route);
  },
// Update an existing bus route
  async update(
    id: number,
    input: Omit<BusRoute, "id">
  ): Promise<BusRoute> {
    const existing = routes.find(
      (item) => item.id === id
    );

    if (!existing) {
      throw new Error(
        "Bus route not found."
      );
    }

    const updated: BusRoute = {
      ...input,
      id,
    };

    routes = routes.map((route) =>
      route.id === id
        ? updated
        : route
    );

    notifyChanges();

    return structuredClone(updated);
  },
// Delete a bus route by its ID
  async delete(id: number): Promise<boolean> {
    const originalLength = routes.length;

    routes = routes.filter(
      (route) => route.id !== id
    );

    const removed =
      routes.length < originalLength;

    if (removed) {
      notifyChanges();
    }

    return removed;
  },
};