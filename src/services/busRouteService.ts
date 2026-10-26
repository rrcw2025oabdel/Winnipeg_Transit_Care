import type { BusRoute } from "../types/busRoutes";

import { busRouteRepository } from "../repositories/busRouteRepository";

type BusRouteInput =
  Omit<BusRoute, "id">;

// Validate the schedule time format
function isValidScheduleTime(
  value: string
): boolean {
  const time =
    "(?:[01]\\d|2[0-3]):[0-5]\\d";

  const pattern = new RegExp(
    `^(?:${time}(?:-${time})?|NA)$`
  );

  return pattern.test(value);
}

// Validate the bus route input
async function validateRoute(
  input: BusRouteInput,
  existingId?: number
) {
  if (
    !input.routeNumber.trim() ||
    !input.routeName.trim() ||
    !input.description.trim()
  ) {
    throw new Error(
      "Route number, name and description are required."
    );
  }

  const routes =
    await busRouteRepository.getAll();

  const duplicate = routes.some(
    (route) =>
      route.id !== existingId &&
      route.routeNumber
        .trim()
        .toUpperCase() ===
        input.routeNumber
          .trim()
          .toUpperCase()
  );

  if (duplicate) {
    throw new Error(
      "That route number already exists."
    );
  }

  if (
    !isValidScheduleTime(
      input.schedule.time.trim()
    )
  ) {
    throw new Error(
      "Use 09:30, 06:00-00:00 or NA for the schedule."
    );
  }

  if (
    input.busNumber !== undefined &&
    (
      !Number.isInteger(input.busNumber) ||
      input.busNumber <= 0
    )
  ) {
    throw new Error(
      "Bus number must be a positive integer."
    );
  }
}

// Bus route service
export const busRouteService = {
  subscribe(listener: () => void) {
    return busRouteRepository.subscribe(
      listener
    );
  },

  async getAll(): Promise<BusRoute[]> {
    return busRouteRepository.getAll();
  },

  async save(
    input: BusRouteInput,
    existingId?: number
  ): Promise<BusRoute> {
    await validateRoute(
      input,
      existingId
    );

    const normalized: BusRouteInput = {
      ...input,
      routeNumber:
        input.routeNumber.trim(),
      routeName:
        input.routeName.trim(),
      description:
        input.description.trim(),
      neighbourhood:
        input.neighbourhood?.trim() ||
        undefined,
      schedule: {
        ...input.schedule,
        time:
          input.schedule.time.trim(),
      },
    };

    if (existingId !== undefined) {
      return busRouteRepository.update(
        existingId,
        normalized
      );
    }

    return busRouteRepository.create(
      normalized
    );
  },
  
// Delete a bus route by its ID
  async delete(id: number): Promise<void> {
    const removed =
      await busRouteRepository.delete(id);

    if (!removed) {
      throw new Error(
        "Bus route not found."
      );
    }
  },
};