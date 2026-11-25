import { z } from "zod";

export const busRouteIdParams = z.object({
    id: z.coerce.number().int().positive(),
});

export const busRouteBody = z.object({
    routeNumber: z.string().trim().min(1,"Route number is required"),
    routeName: z.string().trim().min(1, "Route name is required"),
    description: z.string().trim().min(1, "Description is required"),
    busNumber: z.number().int().positive().nullish(),
    neighbourhood: z.string().trim().min(1).nullish(),
    weekday: z.string().trim().min(1, "Weekday is required"),
    weekend: z.string().trim().min(1, "Weekend is required"),
    time: z.string().trim().min(1, "Time frame is required"),
    stops: z.array(
        z.object({
            busStopNumber: z.number().int().positive(),
        })
    )
    .optional(),
});

export const busRouteUpdateBody = busRouteBody
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required",
    });

export type BusRouteBody = z.infer<typeof busRouteBody>;
export type BusRouteUpdateBody = z.infer<typeof busRouteUpdateBody>;

