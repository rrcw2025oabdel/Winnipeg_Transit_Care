import {
  useState,
  type FormEvent,
} from "react";

import type { Complaint } from "../../../types/complaint";

import { currentUserId } from "../../../config/session";

import { useComplaints } from "../../../hooks/useComplaints";
import { useBusRoutes } from "../../../hooks/useBusRoutes";
import { useTransitMessage } from "../../../hooks/useTransitMessage";

import { complaintService } from "../../../services/complaintService";

/**
 * Hooks supply shared complaints, routes and banner text.
 *
 * complaintService owns business validation and commands.
 * Repositories own resource storage.
 *
 * Draft fields, preview and feedback remain local UI state.
 */
function CreateComplaint() {
  const {
    complaints,
    loading: complaintsLoading,
    error: complaintsError,
  } = useComplaints(currentUserId);

  const {
    routes,
    loading: routesLoading,
    error: routesError,
  } = useBusRoutes();

  const {
    transitMessage,
    setTransitMessage,
  } = useTransitMessage();

  const [selectedRoute, setSelectedRoute] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [latestComplaint, setLatestComplaint] =
    useState<Complaint | null>(null);

  const availableRoutes = routes.map(
    (route) =>
      `${route.routeNumber} - ${route.routeName}`
  );

  const route = availableRoutes.includes(
    selectedRoute
  )
    ? selectedRoute
    : availableRoutes[0] ?? "";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const created =
        await complaintService.create({
          userId: currentUserId,
          route,
          title,
          description,
          status: "Open",
        });

      setLatestComplaint(created);

      setTitle("");
      setDescription("");
      setSelectedRoute("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to submit complaint."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!latestComplaint) return;

    setError("");
    setSaving(true);

    try {
      await complaintService
        .cancelByComplaintId(
          latestComplaint.complaintId,
          currentUserId
        );

      setLatestComplaint(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to cancel complaint."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="create-complaint">
      <h2>File a Complaint</h2>

      <p>
        {complaintsLoading
          ? "Loading your complaints..."
          : `Your complaints: ${complaints.length}`}
      </p>

      {(error || routesError || complaintsError) && (
        <p role="alert">
          {error || routesError || complaintsError}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="complaint-route">
            Bus Route
          </label>

          <select
            id="complaint-route"
            value={route}
            onChange={(event) =>
              setSelectedRoute(
                event.target.value
              )
            }
            disabled={routesLoading}
            required
          >
            {availableRoutes.map(
              (label) => (
                <option
                  key={label}
                  value={label}
                >
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label htmlFor="complaint-title">
            Title
          </label>

          <input
            id="complaint-title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="complaint-description">
            Description
          </label>

          <textarea
            id="complaint-description"
            rows={5}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={
            saving ||
            routesLoading ||
            routes.length === 0
          }
        >
          {saving
            ? "Saving..."
            : "Submit Complaint"}
        </button>
      </form>

      <div className="complaint-preview">
        <h3>Preview</h3>

        <p>
          <strong>Route:</strong>{" "}
          {route || "No routes available"}
        </p>

        <p>
          <strong>Title:</strong>{" "}
          {title || "(untitled)"}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {description ||
            "(no description yet)"}
        </p>
      </div>

      {latestComplaint && (
        <div className="latest-complaint">
          <h3>Latest Complaint Filed</h3>

          <p>
            {latestComplaint.title}
            {" — "}
            {latestComplaint.route}
          </p>

          <p>
            {latestComplaint.description}
          </p>

          <p>
            Status: {latestComplaint.status}
          </p>

          <button
            type="button"
            onClick={() => {
              void handleCancel();
            }}
            disabled={saving}
          >
            Cancel Complaint
          </button>
        </div>
      )}

      <p>{transitMessage}</p>

      <button
        type="button"
        onClick={() =>
          setTransitMessage(
            "Bus delayed due to a bug in production."
          )
        }
      >
        New Transit Message
      </button>
    </section>
  );
}

export default CreateComplaint;