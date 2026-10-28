import {
  useState,
  type FormEvent,
} from "react";

import type { BusRoute } from "../../../types/busRoutes";

import { useBusRoutes } from "../../../hooks/useBusRoutes";
import { useTransitMessage } from "../../../hooks/useTransitMessage";

import { busRouteService } from "../../../services/busRouteService";

const emptyForm = {
  routeNumber: "",
  routeName: "",
  description: "",
  time: "",
  busNumber: "",
  neighbourhood: "",
};

/**
 * Uses useBusRoutes to load shared route recods and refresh 
 * the display when repository data changes.
 * 
 * buseRouteService validates route input and deals with
 * creat, update, and delete commands.
 * 
 * busRouteRepository ows data access and importas the initial route fixtures
 * 
 * Form drafts, filter selection, favouriting remain local presentation state
 * 
 */

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

  const [favourites, setFavourites] =
    useState<number[]>([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  function handleChange(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function toggleFavourite(id: number) {
    setFavourites((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  function editRoute(route: BusRoute) {
    setEditingId(route.id);
    setError("");

    setForm({
      routeNumber: route.routeNumber,
      routeName: route.routeName,
      description: route.description,
      time: route.schedule.time,
      busNumber:
        route.busNumber?.toString() ?? "",
      neighbourhood:
        route.neighbourhood ?? "",
    });
  }

  function clearForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    const existing = routes.find(
      (route) => route.id === editingId
    );

    try {
      await busRouteService.save(
        {
          routeNumber: form.routeNumber,
          routeName: form.routeName,
          description: form.description,

          stops: existing?.stops ?? [],

          schedule: {
            weekday:
              existing?.schedule.weekday ??
              "NA",

            weekend:
              existing?.schedule.weekend ??
              "NA",

            time: form.time,
          },

          busNumber: form.busNumber.trim()
            ? Number(form.busNumber)
            : undefined,

          neighbourhood:
            form.neighbourhood,
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

  async function deleteRoute(id: number) {
    setError("");

    try {
      await busRouteService.delete(id);

      setFavourites((current) =>
        current.filter(
          (item) => item !== id
        )
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

  const neighbourhoods = [
    "All",

    ...new Set(
      routes
        .map(
          (route) =>
            route.neighbourhood
        )
        .filter(
          (name): name is string =>
            Boolean(name)
        )
    ),
  ];

  const filteredRoutes =
    selectedNeighbourhood === "All"
      ? routes
      : routes.filter(
          (route) =>
            route.neighbourhood ===
            selectedNeighbourhood
        );

  const sortedRoutes = [
    ...filteredRoutes,
  ].sort((first, second) => {
    const firstPriority =
      favourites.includes(first.id)
        ? 0
        : 1;

    const secondPriority =
      favourites.includes(second.id)
        ? 0
        : 1;

    return (
      firstPriority - secondPriority
    );
  });

  return (
    <section className="bus-routes">
      <h2>Bus Routes</h2>

      <p>
        View Winnipeg Transit Bus Routes.
        Schedule data is for classroom testing.
      </p>

      {loading && (
        <p>Loading routes...</p>
      )}

      {(error || loadError) && (
        <p role="alert" className="error">
          {error || loadError}
        </p>
      )}

      <div className="filter">
        <label htmlFor="neighbourhood-filter">
          Filter by neighbourhood
        </label>

        <select
          id="neighbourhood-filter"
          value={selectedNeighbourhood}
          onChange={(event) =>
            setSelectedNeighbourhood(
              event.target.value
            )
          }
        >
          {neighbourhoods.map(
            (name) => (
              <option
                key={name}
                value={name}
              >
                {name}
              </option>
            )
          )}
        </select>
      </div>

      <div className="add-route">
        <h3>
          {editingId === null
            ? "Add a Route"
            : "Edit Route"}
        </h3>

        <form onSubmit={handleSave}>
          <div>
            <label htmlFor="route-number">
              Route Number
            </label>

            <input
              id="route-number"
              value={form.routeNumber}
              onChange={(event) =>
                handleChange(
                  "routeNumber",
                  event.target.value
                )
              }
              required
            />
          </div>

          <div>
            <label htmlFor="route-name">
              Route Name
            </label>

            <input
              id="route-name"
              value={form.routeName}
              onChange={(event) =>
                handleChange(
                  "routeName",
                  event.target.value
                )
              }
              required
            />
          </div>

          <div>
            <label htmlFor="route-description">
              Description
            </label>

            <input
              id="route-description"
              value={form.description}
              onChange={(event) =>
                handleChange(
                  "description",
                  event.target.value
                )
              }
              required
            />
          </div>

          <div>
            <label htmlFor="route-time">
              Time or Operating Range
            </label>

            <input
              id="route-time"
              placeholder="09:30, 06:00-00:00 or NA"
              value={form.time}
              onChange={(event) =>
                handleChange(
                  "time",
                  event.target.value
                )
              }
              required
            />
          </div>

          <div>
            <label htmlFor="route-bus-number">
              Bus Number — optional
            </label>

            <input
              id="route-bus-number"
              value={form.busNumber}
              onChange={(event) =>
                handleChange(
                  "busNumber",
                  event.target.value
                )
              }
            />
          </div>

          <div>
            <label htmlFor="route-neighbourhood">
              Neighbourhood — optional
            </label>

            <input
              id="route-neighbourhood"
              value={form.neighbourhood}
              onChange={(event) =>
                handleChange(
                  "neighbourhood",
                  event.target.value
                )
              }
            />
          </div>

          <button
            type="submit"
            disabled={saving || loading}
          >
            {saving
              ? "Saving..."
              : editingId === null
                ? "Add Route"
                : "Save Route"}
          </button>

          <button
            type="button"
            onClick={clearForm}
            disabled={saving}
          >
            Clear Form
          </button>
        </form>
      </div>

      <ul className="route-list">
        {sortedRoutes.map((route) => {
          const isFavourite =
            favourites.includes(route.id);

          return (
            <li
              key={route.id}
              className="route-card"
            >
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
                  onClick={() =>
                    toggleFavourite(route.id)
                  }
                >
                  {isFavourite ? "★" : "☆"}
                </button>

                {" "}
                {route.routeNumber}
                {" — "}
                {route.routeName}
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

              {route.busNumber !== undefined && (
                <p>
                  <strong>Bus Number:</strong>{" "}
                  {route.busNumber}
                </p>
              )}

              {route.neighbourhood && (
                <p>
                  <strong>Neighbourhood:</strong>{" "}
                  {route.neighbourhood}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  editRoute(route)
                }
              >
                Edit Route
              </button>

              <button
                type="button"
                onClick={() => {
                  void deleteRoute(route.id);
                }}
              >
                Delete Route
              </button>
            </li>
          );
        })}
      </ul>

      {!loading &&
        sortedRoutes.length === 0 && (
          <p>
            No routes found for this neighbourhood.
          </p>
        )}

      <p>{transitMessage}</p>

      <button
        type="button"
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