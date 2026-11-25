
import prisma from "../../../config/prisma";
import type { Prisma } from "@prisma/client";

import type {
  CreateComplaintUpdate,
} from "../validations/complaintUpdateSchema";

export const complaintUpdateService = {

  // Retrieving updates for complaints owned by a user.
  async getForUser(userId: number) {
    return prisma.complaintUpdate.findMany({
      where: {
        complaint: {
          userId,
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  },

  // Creating feedback and updating the complaint status.
  async create(data: CreateComplaintUpdate) {

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      // Verifying that the complaint exists.
      const complaint = await tx.complaint.findUnique({
        where: {
          complaintId: data.complaintId,
        },
      });

      if (!complaint) {
        return null;
      }

      // Updating the current complaint status.
      await tx.complaint.update({
        where: {
          complaintId: data.complaintId,
        },
        data: {
          status: data.status,
        },
      });

      // Saving the administrator feedback.
      return tx.complaintUpdate.create({
        data: {
          complaintId: data.complaintId,
          status: data.status,
          adminNote: data.adminNote,
        },
      });
    });
  },
};
