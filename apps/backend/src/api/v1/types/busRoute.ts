export interface BusStop {
    id: number;
    busStopNumber: number;
}

export interface BusRoute {
    id: number;
    routeNumber: string;
    routeName: string;
    description: string;
    stops: BusStop[];
    schedule: { weekeday: string; weekend: string; time: string };
    busNumber: number;
    neighbourhood: string;
}

