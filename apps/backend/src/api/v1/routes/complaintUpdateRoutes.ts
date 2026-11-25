
import { Router } from "express";

import {
  complaintUpdateController,
} from "../controllers/complaintUpdateController";

import {
  complaintUpdateSchema,
  complaintUpdateQuerySchema,
} from "../validations/complaintUpdateSchema";

import { validateRequest } from "../validate";

const router = Router();

// Retrieving complaint updates for a user.
router.get(
  "/",
  validateRequest(complaintUpdateQuerySchema, "query"),
  complaintUpdateController.getForUser
);

// Creating administrator feedback.
router.post(
  "/",
  validateRequest(complaintUpdateSchema),
  complaintUpdateController.create
);

export default router;
