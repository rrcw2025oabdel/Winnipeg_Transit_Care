
import type { Request, Response } from "express";

import {
  complaintUpdateService,
} from "../services/complaintUpdateService";

import type {
  CreateComplaintUpdate,
  ComplaintUpdateQuery,
} from "../validations/complaintUpdateSchema";

export const complaintUpdateController = {

  // GET complaint updates for a specific user.
  async getForUser(
    _req: Request,
    res: Response
  ): Promise<void> {

    try {
      const { userId } =
        res.locals.validatedData as ComplaintUpdateQuery;

      const updates =
        await complaintUpdateService.getForUser(userId);

      res.status(200).json(updates);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to retrieve complaint updates.",
      });
    }
  },

  // POST a new complaint update.
  async create(
    _req: Request,
    res: Response
  ): Promise<void> {

    try {
      const data =
        res.locals.validatedData as CreateComplaintUpdate;

      const update =
        await complaintUpdateService.create(data);

      if (!update) {
        res.status(404).json({
          message: "Complaint not found.",
        });

        return;
      }

      res.status(201).json(update);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create complaint update.",
      });
    }
  },
};
