import { useState } from "react";

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
        time: string; // use military time
    }
    busNumber?: number;  // Number on the side of the bus
    neighbourhood?: string; 
}

function BusRoutes() {
    const routes: BusRoute[] = [
        {
            id: 1, 
            routeNumber: "D14",
            routeName: "Ellice - Airport",
            description: "Bus from the Forks to the Airport",
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
            neighbourhood: "Forks",
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
            neighbourhood: "St. Norbert",
        },

        {
            id: 3, 
            routeNumber: "15",
            routeName: "Saint Vital",
            description: "Route through the Saint Vital area",
            stops: [
                { id: 107, busStopNumber: 30017 },
                { id: 108, busStopNumber: 30018 },
                { id: 109, busStopNumber: 30019 },
            ],
            schedule: {
                weekday: "Friday",
                weekend: "Sunday",
                time: "13:15",
            },
            busNumber: 7777,
            neighbourhood: "Saint Vital",
        },
    ];

    const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<string>("All");

    const neighbourhoods = ["All", ...Array.from(new Set(routes.map((r) => r.neighbourhood)))];

    const filteredRoutes = 
        selectedNeighbourhood === "All"
        ? routes
        : routes.filter((route) => route.neighbourhood === selectedNeighbourhood);


    return (
        <section className="bus-routes">
            <h2>Bus Routes</h2>

            <p>View Winnipeg Transit Bus Routes</p>

            <div className="filter">
                <label htmlFor="neighbourhood-filter">Filter By Neighbourhood: </label>
                <select
                    id="neighbourhood-filter"
                    value={selectedNeighbourhood}
                    onChange={(e) => setSelectedNeighbourhood(e.target.value)}
                >
                    {neighbourhoods.map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                    </select>
            </div>


            <ul className="route-list">
                {filteredRoutes.length === 0 ? (
                    <li>No routes found for this neighbourhood</li>
                ) : (  
                    filteredRoutes.map((route) => (
                    <li key={route.id} className="route-card">
                        <h3>
                            {route.routeNumber} - {route.routeName}
                        </h3>

                        <p>{route.description}</p>
                        <p>
                            <strong>Weekday:</strong> {route.schedule.weekday}
                        </p>

                        <p>
                            <strong>Weekend:</strong> {route.schedule.weekend}
                        </p>
                        
                        <p>
                            <strong>Time:</strong> {route.schedule.time}
                        </p>

                        <p>
                            <strong>Bus Number(optional):</strong> {route.busNumber}
                        </p>

                        <p>
                            <strong>Neighbourhood(optional):</strong> {route.neighbourhood}
                        </p>

                </li>
                ))
                )}
            </ul>
                </section>
    );
}

export default BusRoutes;