import prisma from "../../../config/prisma";
import type {
    BusRoute as BusRouteModel,
    BusStop as BusStopModel,
    Prisma,
} from "@prisma/client";
import type { BusRoute } from "../types/busRoute";

type RouteRow = BusRouteModel & {
    stops: BusStopModel[];
};

export type BusRouteInput = {
    routeNumber: string;
    routeName: string;
    description: string;
    weekday: string;
    weekend: string;
    time: string;
    busNumber?: number | null;
    neighbourhood?: string | null;
    stops?: { busStopNumber: number }[];
};

function toFrontEnd(row: RouteRow): BusRoute {
    return {
        id: row.id,
        routeNumber: row.routeNumber,
        routeName: row.routeName,
        description: row.description,
        stops: row.stops.map((s) => ({
            id: s.id,
            busStopNumber: s.busStopNumber,
        })),
        schedule: {
            weekday: row.weekday,
            weekend: row.weekend,
            time: row.time,
        },
        busNumber: row.busNumber ?? 0,
        neighbourhood: row.neighbourhood ?? "",
    };
}

const routeInclude: Prisma.BusRouteInclude = {
    stops: { orderBy: { id: "asc" } },
};

export const busRouteService = {
    async getAll(): Promise<BusRoute[]> {
        const rows = await prisma.busRoute.findMany({
            include: {
                stops: { orderBy: { id: "asc" } },
            },
            orderBy: { id: "asc" },
        });

        return rows.map(toFrontEnd);
    },

    async getById(id: number): Promise<BusRoute | null> {
        const row = await prisma.busRoute.findUnique({
            where: { id },
            include: {
                stops: { orderBy: { id: "asc" } },
            },
        });

        return row ? toFrontEnd(row) : null;
    },

    async create(data: BusRouteInput): Promise<BusRoute> {
        const row = await prisma.busRoute.create({
            data: {
                routeNumber: data.routeNumber,
                routeName: data.routeName,
                description: data.description,
                weekday: data.weekday,
                weekend: data.weekend,
                time: data.time,
                busNumber: data.busNumber ?? null,
                neighbourhood: data.neighbourhood ?? null,
                stops: {
                    create: data.stops?.map((s) => ({
                        busStopNumber: s.busStopNumber,
                    })),
                },
            },
            include: routeInclude,
        });

        return toFrontEnd(row);
    },

    async update(id: number, data: Partial<BusRouteInput>): Promise<BusRoute | null> {
        const existingRoute = await prisma.busRoute.findUnique({
            where: { id },
            include: routeInclude,
        });

        if (!existingRoute) {
            return null;
        }

        const updatedRoute = await prisma.busRoute.update({
            where: { id },
            data: {
                routeNumber: data.routeNumber ?? existingRoute.routeNumber,
                routeName: data.routeName ?? existingRoute.routeName,
                description: data.description ?? existingRoute.description,
                weekday: data.weekday ?? existingRoute.weekday,
                weekend: data.weekend ?? existingRoute.weekend,
                time: data.time ?? existingRoute.time,
                busNumber: data.busNumber ?? existingRoute.busNumber,
                neighbourhood: data.neighbourhood ?? existingRoute.neighbourhood,
            },
            include: routeInclude,
        });

        return toFrontEnd(updatedRoute);
    },

    async delete(id: number): Promise<boolean> {
        try {
            await prisma.busRoute.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("Error deleting bus route:", error);
            return false;
        }
    },
}

