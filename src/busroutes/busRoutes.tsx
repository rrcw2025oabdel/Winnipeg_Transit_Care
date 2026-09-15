interface BusStop {
    id: number;
    busStopNumber: number;  // 5 digit number eg. #20172
}

interface BusRoute {
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

function BusRoutes() {
    const routes: BusRoute [
        {
            id: 1, 
            routeNumber: "D14",
            routeName: "Ellice - Airport",
            description: "Bus from the Forks to the Airport"
            stops: [
                { id: 101, busStopNumber: 30011 },
                { id: 102, busStopNumber: 30012 },
                { id: 103, busStopNumber: 30013 },
            ],
            schedule: {
                weekday: "Monday",
                weekend: "NA",
                time: "9:00",
            },
            busNumber: 5555, 
        },
        { 
            id: 2, 
            routeNumber: "BLUE",
            routeName: "St. Norbert",
            description: "Blue line from Assiniboia Downs to St. Norbert",
            stops: [
                { id: 104, busStopNumber: 30014 },
                { id: 105, busStopNumber: 30015 },
                { id: 106, busStopNumber: 30016 },
            ],
            schedule: {
                weekday: "NA",
                weekend: "Saturday", 
                time: "00:00",
            },
            busNumber: 6666,
        },
        
