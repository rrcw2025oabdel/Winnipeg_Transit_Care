interface BusStop {
    id: number;
    busStopNumber: number;  // 5 digit number eg. #20172
}

interface BusRoutes {
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

export function BusStops() {
    const stops: BusStop[] = [
        {
            id: 1,
            busStopNumber: 30154, 
        },

        {
            id: 2,
            busStopNumber: 52173, 
        },

        {
            id: 3,
            busStopNumber: 30154, 
        },
    ]
}

