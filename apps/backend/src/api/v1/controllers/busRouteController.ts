import { Request, Response } from "express";
import { busRouteService } from "../services/busRoutesService";

export const busRouteController = {

    // GET all bus routes.
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const busRoutes = await busRouteService.getAll();
            res.status(200).json(busRoutes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to retrieve bus routes." });
        }
    },

    // GET a bus route by ID.
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.validatedData;
            const busRoute = await busRouteService.getById(id);
            if (!busRoute) {
                res.status(404).json({ message: "Bus route not found." });
                return;
            }
            res.status(200).json(busRoute);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to retrieve bus route." });
        }
    },

    // POST a new bus route.
    async create(req: Request, res: Response): Promise<void> {
        try {
            const data = res.locals.validatedData;
            const busRoute = await busRouteService.create(data);
            res.status(201).json(busRoute);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to create bus route." });
        }
    },

    // PUT update a bus route by ID.
    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.validatedData;
            const data = res.locals.validatedData;
            const busRoute = await busRouteService.update(id, data);
            if (!busRoute) {
                res.status(404).json({ message: "Bus route not found." });
                return;
            }
            res.status(200).json(busRoute);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to update bus route." });
        }
    },

    // DELETE a bus route by ID.
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = res.locals.validatedData;
            const success = await busRouteService.delete(id);
            if (!success) {
                res.status(404).json({ message: "Bus route not found." });
                return;
            }
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to delete bus route." });
        }
    },
};