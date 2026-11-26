
import type { Request, Response } from "express";

import {
  complaintService,
} from "../services/complaintService";

import type {
  CreateComplaint,
  ArchiveComplaint,
  ComplaintQuery,
} from "../validations/complaintSchema";

export const complaintController = {

  // GET complaints for a specific user.
  async getForUser(
    _req: Request,
    res: Response
  ): Promise<void> {

    try {
      const { userId } =
        res.locals.validatedData as ComplaintQuery;

      const complaints =
        await complaintService.getForUser(userId);

      res.status(200).json(complaints);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to retrieve complaints.",
      });
    }
  },

  // POST a new complaint.
  async create(
    _req: Request,
    res: Response
  ): Promise<void> {

    try {
      const data =
        res.locals.validatedData as CreateComplaint;

      const complaint =
        await complaintService.create(data);

      if (!complaint) {
        res.status(400).json({
          message: "Selected bus route does not exist.",
        });

        return;
      }

      res.status(201).json(complaint);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create complaint.",
      });
    }
  },

  // PATCH a complaint to archive or restore it.
  // The ID comes from the URL (already validated by the params middleware).
  async setArchived(
    req: Request,
    res: Response
  ): Promise<void> {

    try {
      const complaintId = Number(req.params.id);

      const { userId, archived } =
        res.locals.validatedData as ArchiveComplaint;

      const complaint =
        await complaintService.setArchived(
          complaintId,
          userId,
          archived
        );

      if (!complaint) {
        res.status(404).json({
          message: "Complaint not found.",
        });

        return;
      }

      res.status(200).json(complaint);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update complaint.",
      });
    }
  },

  // DELETE/CANCEL a complaint.
  async remove(
    req: Request,
    res: Response
  ): Promise<void> {

    try {
      const complaintId = Number(req.params.id);

      const { userId } =
        res.locals.validatedData as ComplaintQuery;

      const removed =
        await complaintService.remove(complaintId, userId);

      if (!removed) {
        res.status(404).json({
          message: "Complaint not found.",
        });

        return;
      }

      res.status(204).send();

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete complaint.",
      });
    }
  },
};
