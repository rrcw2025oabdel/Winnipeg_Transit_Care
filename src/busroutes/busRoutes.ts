export interface BusStop {
    id: number;
    busStopNumber: number;  // 5 digit number eg. #20172
}

export interface BusRoutes {
    id: number;
    routeNumber: string;  // eg BLUE, D14
    routeName: string;  // BLUE St. Norbert, D14 - Ellice
    description: string; // 
    stops: BusStop[];
    schedule: {
        weekday: string;
        weekend: string;
        time: string;
    }
    busNumber?: number;  // Number on the side of the bus
}