export interface BusStop {
    id: number;
    busStopNumber: number;  // 5 digit number eg. #20172
}

export interface BusSchedule {
    weekday: string;
    weekend: string;
    time: string; // military time HH:MM
}

export interface BusRoute {
    id: number;
    routeNumber: string;  // eg BLUE, D14
    routeName: string;  // BLUE St. Norbert, D14 - Ellice
    description: string; // 
    stops: BusStop[];
    schedule: BusSchedule;
    busNumber?: number;  // Number on the side of the bus
    neighbourhood?: string; 
}

export type BusRouteForm = {
    routeNumber: string;
    routeName: string;
    description: string;
    time: string;
    neighbourhood: string;
}