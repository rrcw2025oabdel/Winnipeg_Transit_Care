
import { Router } from "express";

import {
  complaintController,
} from "../controllers/complaintController";

import {
  createComplaintSchema,
  archiveComplaintSchema,
  complaintQuerySchema,
  complaintParamsSchema,
} from "../validations/complaintSchema";

import { validateRequest } from "../validate";

const router = Router();

// Retrieving the complaints for a user: GET /?userId=1
router.get(
  "/",
  validateRequest(complaintQuerySchema, "query"),
  complaintController.getForUser
);

// Creating the complaint.
router.post(
  "/",
  validateRequest(createComplaintSchema),
  complaintController.create
);

// Archiving or restoring a complaint: PATCH /:id
// validateRequest keeps only the last validated data, so the ID is
// validated first and then read from req.params in the controller.
router.patch(
  "/:id",
  validateRequest(complaintParamsSchema, "params"),
  validateRequest(archiveComplaintSchema),
  complaintController.setArchived
);

// Cancelling a complaint: DELETE /:id?userId=1
router.delete(
  "/:id",
  validateRequest(complaintParamsSchema, "params"),
  validateRequest(complaintQuerySchema, "query"),
  complaintController.remove
);

export default router;
