import { Router } from "express";

import { busRouteController } from "../controllers/busRouteController";
import { busRouteIdParams, busRouteBody, busRouteUpdateBody } from "../validations/busRoutesSchema";
import { validateRequest } from "../validate";

const router = Router();

// GET all bus routes.
router.get("/", busRouteController.getAll);

// GET a bus route by ID.
router.get("/:id", validateRequest(busRouteIdParams, "params"), busRouteController.getById);

// POST a new bus route.
router.post("/", validateRequest(busRouteBody), busRouteController.create);

// PUT update a bus route by ID.
router.put("/:id", validateRequest(busRouteIdParams, "params"), validateRequest(busRouteUpdateBody), busRouteController.update);

// DELETE a bus route by ID.
router.delete("/:id", validateRequest(busRouteIdParams, "params"), busRouteController.delete);

export default router;