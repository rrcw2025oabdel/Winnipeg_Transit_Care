import { useState, type FormEvent } from "react";

import type { BusRoute } from "../../../types/busRoutes";
import { useBusRoutes } from "../../../hooks/useBusRoutes";
import { useTransitMessage } from "../../../hooks/useTransitMessage";
import { busRouteService } from "../../../services/busRouteService";

import "./busRoutes.css";

const emptyForm = {
  routeNumber: "",
  routeName: "",
  description: "",
  weekday: "",
  weekend: "",
  time: "",
  busNumber: "",
  neighbourhood: "",
  stops: "",
};

function BusRoutes() {
  const {
    routes,
    loading,
    error: loadError,
  } = useBusRoutes();

  const {
    transitMessage,
    setTransitMessage,
  } = useTransitMessage();

  const [selectedNeighbourhood, setSelectedNeighbourhood] =
    useState("All");

  const [favourites, setFavourites] = useState<number[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Update a form field
  function handleChange(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  // Add or remove a favourite route
  function toggleFavourite(id: number) {
    setFavourites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  // Populate the form with the selected route
  function editRoute(route: BusRoute) {
    setEditingId(route.id);
    setError("");

    setForm({
      routeNumber: route.routeNumber,
      routeName: route.routeName,
      description: route.description,
      weekday: route.schedule.weekday,
      weekend: route.schedule.weekend,
      time: route.schedule.time,
      busNumber: route.busNumber
        ? route.busNumber.toString()
        : "",
      neighbourhood: route.neighbourhood ?? "",
      stops: route.stops
        .map((stop) => stop.busStopNumber)
        .join(", "),
    });

    document.getElementById("route-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Reset the form
  function clearForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  // Create or update a bus route
  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSaving(true);

    try {
      if (
        !form.routeNumber.trim() ||
        !form.routeName.trim() ||
        !form.description.trim() ||
        !form.weekday.trim() ||
        !form.weekend.trim() ||
        !form.time.trim()
      ) {
        throw new Error("Please complete all required fields.");
      }

      // Convert comma-separated stop numbers into an array
      const stopNumbers = form.stops.trim()
        ? form.stops.split(",").map(
            (value) => Number(value.trim())
          )
        : [];

      if (
        stopNumbers.some(
          (number) =>
            !Number.isInteger(number) || number <= 0
        )
      ) {
        throw new Error(
          "Bus stop numbers must be positive integers."
        );
      }

      if (new Set(stopNumbers).size !== stopNumbers.length) {
        throw new Error(
          "Duplicate bus stops are not allowed."
        );
      }

      const busNumber = form.busNumber.trim()
        ? Number(form.busNumber)
        : undefined;

      if (
        busNumber !== undefined &&
        (!Number.isInteger(busNumber) || busNumber <= 0)
      ) {
        throw new Error(
          "Bus number must be a positive integer."
        );
      }

      await busRouteService.save(
        {
          routeNumber: form.routeNumber.trim(),
          routeName: form.routeName.trim(),
          description: form.description.trim(),

          stops: stopNumbers.map((busStopNumber, index) => ({
            id: index + 1,
            busStopNumber,
          })),

          schedule: {
            weekday: form.weekday.trim(),
            weekend: form.weekend.trim(),
            time: form.time.trim(),
          },

          busNumber,

          neighbourhood:
            form.neighbourhood.trim() || undefined,
        },
        editingId ?? undefined
      );

      clearForm();

    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save route."
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete a bus route
  async function deleteRoute(id: number) {
    setError("");

    try {
      await busRouteService.delete(id);

      setFavourites((current) =>
        current.filter((item) => item !== id)
      );

      if (editingId === id) {
        clearForm();
      }

    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to delete route."
      );
    }
  }

  // Build the neighbourhood filter
  const neighbourhoods = [
    "All",
    ...new Set(
      routes
        .map((route) => route.neighbourhood)
        .filter((name): name is string => Boolean(name))
    ),
  ];

  const filteredRoutes =
    selectedNeighbourhood === "All"
      ? routes
      : routes.filter(
          (route) =>
            route.neighbourhood === selectedNeighbourhood
        );

  // Display favourite routes first
  const sortedRoutes = [...filteredRoutes].sort(
    (first, second) => {
      const firstPriority =
        favourites.includes(first.id) ? 0 : 1;

      const secondPriority =
        favourites.includes(second.id) ? 0 : 1;

      return firstPriority - secondPriority;
    }
  );

  return (
    <section className="bus-routes">

      <h2>Bus Routes</h2>

      <p>
        View Winnipeg Transit Bus Routes.
        Schedule data is for classroom testing.
      </p>

      {loading && <p>Loading routes...</p>}

      {loadError && (
        <p role="alert" className="error">
          {loadError}
        </p>
      )}

      {/* Neighbourhood filter */}

      <div className="filter">
        <label htmlFor="neighbourhood-filter">
          Filter by neighbourhood
        </label>

        <select
          id="neighbourhood-filter"
          value={selectedNeighbourhood}
          onChange={(event) =>
            setSelectedNeighbourhood(event.target.value)
          }
        >
          {neighbourhoods.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Add and edit route form */}

      <div className="add-route" id="route-form">

        <h3>
          {editingId === null ? "Add a Route" : "Edit Route"}
        </h3>

        <p className="form-description">
          Enter the route information and operating schedule.
        </p>

        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}

        <form className="route-form" onSubmit={handleSave}>

          <div className="route-field">
            <label htmlFor="route-number">
              Route Number *
            </label>

            <input
              id="route-number"
              placeholder="e.g. 20 or BLUE"
              value={form.routeNumber}
              onChange={(event) =>
                handleChange("routeNumber", event.target.value)
              }
              required
            />
          </div>

          <div className="route-field">
            <label htmlFor="route-name">
              Route Name *
            </label>

            <input
              id="route-name"
              placeholder="e.g. Downtown"
              value={form.routeName}
              onChange={(event) =>
                handleChange("routeName", event.target.value)
              }
              required
            />
          </div>

          <div className="route-field full-width">
            <label htmlFor="route-description">
              Description *
            </label>

            <textarea
              id="route-description"
              rows={3}
              placeholder="Enter the route description"
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              required
            />
          </div>

          <div className="route-field">
            <label htmlFor="route-weekday">
              Weekday Schedule *
            </label>

            <input
              id="route-weekday"
              placeholder="Monday to Friday or NA"
              value={form.weekday}
              onChange={(event) =>
                handleChange("weekday", event.target.value)
              }
              required
            />
          </div>

          <div className="route-field">
            <label htmlFor="route-weekend">
              Weekend Schedule *
            </label>

            <input
              id="route-weekend"
              placeholder="Saturday and Sunday or NA"
              value={form.weekend}
              onChange={(event) =>
                handleChange("weekend", event.target.value)
              }
              required
            />
          </div>

          <div className="route-field full-width">
            <label htmlFor="route-time">
              Operating Hours *
            </label>

            <input
              id="route-time"
              placeholder="09:30, 06:00-23:00 or NA"
              value={form.time}
              onChange={(event) =>
                handleChange("time", event.target.value)
              }
              required
            />

            <small>
              Use HH:MM, HH:MM-HH:MM or NA.
            </small>
          </div>

          <div className="route-field">
            <label htmlFor="route-bus-number">
              Bus Number (optional)
            </label>

            <input
              id="route-bus-number"
              type="number"
              min={1}
              step={1}
              placeholder="e.g. 120"
              value={form.busNumber}
              onChange={(event) =>
                handleChange("busNumber", event.target.value)
              }
            />
          </div>

          <div className="route-field">
            <label htmlFor="route-neighbourhood">
              Neighbourhood (optional)
            </label>

            <input
              id="route-neighbourhood"
              placeholder="e.g. St. Boniface"
              value={form.neighbourhood}
              onChange={(event) =>
                handleChange("neighbourhood", event.target.value)
              }
            />
          </div>

          <div className="route-field full-width">
            <label htmlFor="route-stops">
              Bus Stop Numbers (optional)
            </label>

            <input
              id="route-stops"
              placeholder="10501, 10502, 10503"
              value={form.stops}
              onChange={(event) =>
                handleChange("stops", event.target.value)
              }
            />

            <small>
              Separate bus stop numbers with commas.
            </small>
          </div>

          <div className="route-actions full-width">

            <button
              type="submit"
              className="route-btn route-btn-primary"
              disabled={saving || loading}
            >
              {saving
                ? "Saving..."
                : editingId === null
                  ? "Add Route"
                  : "Save Changes"}
            </button>

            <button
              type="button"
              className="route-btn route-btn-secondary"
              onClick={clearForm}
              disabled={saving}
            >
              {editingId === null ? "Clear Form" : "Cancel Edit"}
            </button>

          </div>

        </form>
      </div>

      {/* Bus route cards */}

      <ul className="route-list">

        {sortedRoutes.map((route) => {
          const isFavourite = favourites.includes(route.id);

          return (
            <li key={route.id} className="route-card">

              <h3>
                <button
                  type="button"
                  className="favourite-button"
                  aria-pressed={isFavourite}
                  aria-label={
                    isFavourite
                      ? `Remove ${route.routeNumber} from favourites`
                      : `Add ${route.routeNumber} to favourites`
                  }
                  onClick={() => toggleFavourite(route.id)}
                >
                  {isFavourite ? "★" : "☆"}
                </button>

                {route.routeNumber} — {route.routeName}
              </h3>

              <p>{route.description}</p>

              <p>
                <strong>Weekday:</strong>{" "}
                {route.schedule.weekday}
              </p>

              <p>
                <strong>Weekend:</strong>{" "}
                {route.schedule.weekend}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {route.schedule.time}
              </p>

              <p>
                <strong>Bus Number:</strong>{" "}
                {route.busNumber || "Not assigned"}
              </p>

              <p>
                <strong>Neighbourhood:</strong>{" "}
                {route.neighbourhood || "Not specified"}
              </p>

              <p>
                <strong>Bus Stops:</strong>{" "}
                {route.stops.length > 0
                  ? route.stops
                      .map((stop) => stop.busStopNumber)
                      .join(", ")
                  : "No stops assigned"}
              </p>

              <div className="route-actions">

                <button
                  type="button"
                  className="route-btn route-btn-primary"
                  disabled={saving}
                  onClick={() => editRoute(route)}
                >
                  Edit Route
                </button>

                <button
                  type="button"
                  className="route-btn route-btn-danger"
                  disabled={saving}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete route ${route.routeNumber}?`
                      )
                    ) {
                      void deleteRoute(route.id);
                    }
                  }}
                >
                  Delete Route
                </button>

              </div>

            </li>
          );
        })}

      </ul>

      {!loading && sortedRoutes.length === 0 && (
        <p className="empty-routes">
          No routes found for this neighbourhood.
        </p>
      )}

      {/* Transit message */}

      <div className="route-transit-message">

        <p>{transitMessage}</p>

        <button
          type="button"
          className="route-btn route-btn-primary"
          onClick={() =>
            setTransitMessage(
              "Next stop: Production. Please commit before exiting."
            )
          }
        >
          New Transit Message
        </button>

      </div>

    </section>
  );
}

export default BusRoutes;