
import prisma from "../../../config/prisma";

import type {
  CreateComplaint,
} from "../validations/complaintSchema";

// Include the route's number and name so the front-end can show it as text.
const withRoute = {
  route: {
    select: {
      routeNumber: true,
      routeName: true,
    },
  },
} as const;

// Turns the nested route into the "D10 - Panet" label the front-end displays.
function toResponse<
  T extends { route: { routeNumber: string; routeName: string } }
>(complaint: T) {
  const { route, ...rest } = complaint;

  return {
    ...rest,
    route: `${route.routeNumber} - ${route.routeName}`,
  };
}

export const complaintService = {

  // Retrieving the complaints owned by a user.
  async getForUser(userId: number) {
    const complaints = await prisma.complaint.findMany({
      where: { userId },
      include: withRoute,
      orderBy: { complaintId: "asc" },
    });

    return complaints.map(toResponse);
  },

  // Creates a complaint. Returns null if the bus route does not exist.
  async create(data: CreateComplaint) {
    const route = await prisma.busRoute.findUnique({
      where: { id: data.routeId },
    });

    if (!route) {
      return null;
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: data.userId,
        routeId: data.routeId,
        title: data.title,
        description: data.description,
        status: "Submitted",
      },
      include: withRoute,
    });

    return toResponse(complaint);
  },

  // Archiving or restoring a complaint.
  // Returns null if the complaint does not exist for the user.
  async setArchived(
    complaintId: number,
    userId: number,
    archived: boolean
  ) {
    const existing = await prisma.complaint.findFirst({
      where: { complaintId, userId },
    });

    if (!existing) {
      return null;
    }

    const complaint = await prisma.complaint.update({
      where: { complaintId },
      data: { archived },
      include: withRoute,
    });

    return toResponse(complaint);
  },

  // Deleting/Cancelling a complaint owned by the user.
  // Returns false if nothing was deleted.
  async remove(complaintId: number, userId: number) {
    const result = await prisma.complaint.deleteMany({
      where: { complaintId, userId },
    });

    return result.count > 0;
  },
};
