import { useState } from "react";

type BusRoutesProps = {
  transitMessage: string;
  setTransitMessage: (message: string) => void;
};

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

const initialRoutes: BusRoute[] = [
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

const emptyForm = {
    routeNumber: "",
    routeName: "",
    description: "",
    time: "",
    busNumber: "",
    neighbourhood: "",
}

function BusRoutes({
    transitMessage,
    setTransitMessage,
}: BusRoutesProps) {
    const [routes, setRoutes] = useState<BusRoute[]>(initialRoutes);
    const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<string>("All");
    const [favourites, setFavourites] = useState<number[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    
    const toggleFavourite = (id: number) => {
        setFavourites((prev) =>
            prev.includes(id) ? prev.filter((favID) => favID !== id) : [...prev, id]
        );
    };

    const handleChange = (field: keyof typeof emptyForm, value: string) => { setForm((prev) => ({ ...prev, [field]: value }));
    
    };


// Returns an object of error messages
    const validate = () => {
        const newErrors: Record<string, string> = {};
        const routeNumber = form.routeNumber.trim();
        const routeName = form.routeName.trim();
        const description = form.description.trim();
        const busNumber = form.busNumber.trim();

        if (!routeNumber) {
            newErrors.routeNumber = "Route number is required";
        } else if (routes.some((r) => r.routeNumber.toUpperCase() ===
        routeNumber.toUpperCase())) { 
        newErrors.routeNumber = "That route number already exist.";
        }
        if (!routeName) newErrors.routeName = "Route name is required.";
        if (!description) newErrors.description = "Description is requred";

        // military time hh:mm 
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(form.time)) {
            newErrors.time = "Enter a time like 9:30 (24 hour, hh:mm).";
        }
        return newErrors;
    };

    const addRoute = () => {
        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const newRoute: BusRoute = {
            id: Date.now(),
            routeNumber: form.routeNumber.trim(),
            routeName: form.routeName.trim(),
            description: form.description.trim(),
            stops: [],
            schedule: {
                weekday: "NA",
                weekend: "NA",
                time: form.time.trim(),
            },
            busNumber: form.busNumber ? parseInt(form.busNumber.trim()) : undefined,
            neighbourhood: form.neighbourhood.trim() || undefined,
        };
        setRoutes((prev) => [...prev, newRoute]);
        setForm(emptyForm);
    };

    const deleteRoute = (id: number) => {
        setRoutes((prev) => prev.filter((route) => route.id !== id));
        setFavourites((prev) => prev.filter((favID) => favID !== id));
    };

    const neighbourhoods = ["All", ...Array.from(new Set(initialRoutes.map((r) => r.neighbourhood)))];

    const filteredRoutes = 
        selectedNeighbourhood === "All"
        ? routes
        : routes.filter((route) => route.neighbourhood === selectedNeighbourhood);

    const sortedRoutes = [...filteredRoutes].sort((a, b) => {
        const aFav = favourites.includes(a.id) ? 0 : 1;
        const bFav = favourites.includes(b.id) ? 0 : 1;
        return aFav - bFav;
    });
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
            <div className= "add-route">    
                <h3>Add a Route</h3>
                <div>
                    <label htmlFor="routeNumber">Route Number</label>
                    <input
                        id="routeNumber"
                        value={form.routeNumber}
                        onChange={(e) => handleChange("routeNumber", e.target.value)}
                        />
                    {errors.routeNumber && <p role="alert" className="error">{errors.routeNumber}</p>}
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <input
                        id="description"
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                    {errors.description && <p role="alert" className="error">{errors.description}</p>}
                    </div>
                <div>
                    <label htmlFor="neighbourhood">Neighbourhood</label>
                    <input
                        id="neighbourhood"
                        value={form.neighbourhood}
                        onChange={(e) => handlechange("neighbourhood", e.target.value)}
                        />
                </div>
                <button onClick={addRoute}>Add Route</button>
                </div>

            <ul className="route-list">
                {sortedRoutes.length === 0 ? (
                    <li>No routes found for this neighbourhood</li>
                ) : (  
                    sortedRoutes.map((route) => {
                        const isFavourite = favourites.includes(route.id);
                        
                        return (
                    <li key={route.id} className="route-card">
                        <h3>
                            <button
                                className="favourite-button"
                                onClick={() => toggleFavourite(route.id)}
                                aria-label={
                                    favourites.includes(route.id)
                                    ? `Remove ${route.routeNumber} from favourites`
                                    : `Add ${route.routeNumber} to favourites`
                                }
                                aria-pressed={favourites.includes(route.id)}
                            >
                                {isFavourite ? "★" : "☆"}
                            </button>
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
                );       
            })
        )}
            </ul>
            <p>{transitMessage}</p>
{/*Button to update the transit message*/}
<button
  onClick={() =>
    setTransitMessage(
      "Next stop: Production. Please commit before exiting."
    )
  }
>
  New Transit Message
</button>
            </section>
    );
}

export default BusRoutes;