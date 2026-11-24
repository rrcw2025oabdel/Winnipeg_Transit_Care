import { useState } from "react";

import { currentUserId } from "../../../config/session";
import { complaintStatuses } from "../../../types/complaint";

import { useComplaints } from "../../../hooks/useComplaints";
import { useComplaintUpdates } from "../../../hooks/useComplaintUpdates";
import { useTransitMessage } from "../../../hooks/useTransitMessage";

import { complaintService } from "../../../services/complaintService";

import AdminStatusForm from "./AdminStatusForm";

import "./ViewMyComplaints.css";

/**
 * Uses useComplaints to display the customer's submissions.
 *
 * Uses useComplaintUpdates to display each complaint's admin
 * update history, with the latest response first.
 *
 * Services handle business rules and repositories handle data.
 * Selected filters and displayed action errors remain local.
 */
function MyComplaints() {
  const {
    complaints,
    loading,
    error: loadError,
  } = useComplaints(currentUserId);

  const {
    updates,
    loading: updatesLoading,
    error: updatesError,
  } = useComplaintUpdates(currentUserId);

  const {
    transitMessage,
    setTransitMessage,
  } = useTransitMessage();

  const [statusFilter, setStatusFilter] = useState("All");
  const [actionError, setActionError] = useState("");

  const filteredComplaints = complaints.filter(
    (complaint) =>
      !complaint.archived &&
      (statusFilter === "All" ||
        complaint.status === statusFilter)
  );

  const archivedComplaints = complaints.filter(
    (complaint) => complaint.archived
  );

  async function changeArchiveState(
    complaintId: number,
    archived: boolean
  ) {
    try {
      await complaintService.setArchived(
        complaintId,
        currentUserId,
        archived
      );

      setActionError("");
    } catch (cause) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : "Unable to change complaint."
      );
    }
  }

  return (
    <section className="my-complaints">
      <h2>My Complaints</h2>

      <p>
        Review the complaints you have submitted
        to Winnipeg Transit Care.
      </p>

      {loading && <p>Loading complaints...</p>}

      {(loadError || actionError) && (
        <p role="alert">
          {loadError || actionError}
        </p>
      )}

      {updatesLoading && (
        <p>Loading admin updates...</p>
      )}

      {updatesError && (
        <p role="alert">{updatesError}</p>
      )}

      <label htmlFor="status-filter">
        Filter by status
      </label>

      <select
        id="status-filter"
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value)
        }
      >
        <option value="All">All</option>

        {complaintStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <ul className="complaint-list">
        {filteredComplaints.map((complaint) => {
          const complaintUpdates = updates
            .filter(
              (update) =>
                update.complaintId === complaint.complaintId
            )
            .sort((first, second) => second.id - first.id);

          return (
            <li
              key={complaint.complaintId}
              className="complaint-card"
            >
              <button
                type="button"
                onClick={() => {
                  void changeArchiveState(
                    complaint.complaintId,
                    true
                  );
                }}
              >
                Archive
              </button>

              <h3>{complaint.title}</h3>

              <p>
                <strong>Route:</strong>{" "}
                {complaint.route}
              </p>

              <p>{complaint.description}</p>

              <p>
                <strong>Current status:</strong>{" "}
                {complaint.status}
              </p>

              <div className="admin-updates">
                <h4>Admin Updates</h4>

                {complaintUpdates.map((update, index) => (
                  <div
                    key={update.id}
                    className={
                      index === 0
                        ? "admin-update admin-update-latest"
                        : "admin-update admin-update-previous"
                    }
                  >
                    <p className="admin-update-label">
                      {index === 0
                        ? "Latest admin update"
                        : "Previous admin update"}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="admin-update-status">
                        {update.status}
                      </span>
                    </p>

                    <p>
                      <strong>Feedback:</strong>{" "}
                      {update.adminNote}
                    </p>
                  </div>
                ))}

                {!updatesLoading &&
                  !updatesError &&
                  complaintUpdates.length === 0 && (
                    <p>No admin updates yet.</p>
                  )}
              </div>
            </li>
          );
        })}
      </ul>

      {!loading &&
        !loadError &&
        filteredComplaints.length === 0 && (
          <p>
            No complaints match the selected status.
          </p>
        )}

      <h3>Archived Complaints</h3>

      {!loading &&
        !loadError &&
        archivedComplaints.length === 0 && (
          <p>No archived complaints.</p>
        )}

      <ul className="complaint-list">
        {archivedComplaints.map((complaint) => {
          const complaintUpdates = updates
            .filter(
              (update) =>
                update.complaintId === complaint.complaintId
            )
            .sort((first, second) => second.id - first.id);

          return (
            <li
              key={complaint.complaintId}
              className="complaint-card"
            >
              <h3>{complaint.title}</h3>

              <p>
                <strong>Route:</strong>{" "}
                {complaint.route}
              </p>

              <p>{complaint.description}</p>

              <p>
                <strong>Current status:</strong>{" "}
                {complaint.status}
              </p>

              <div className="admin-updates">
                <h4>Admin Updates</h4>

                {complaintUpdates.map((update, index) => (
                  <div
                    key={update.id}
                    className={
                      index === 0
                        ? "admin-update admin-update-latest"
                        : "admin-update admin-update-previous"
                    }
                  >
                    <p className="admin-update-label">
                      {index === 0
                        ? "Latest admin update"
                        : "Previous admin update"}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="admin-update-status">
                        {update.status}
                      </span>
                    </p>

                    <p>
                      <strong>Feedback:</strong>{" "}
                      {update.adminNote}
                    </p>
                  </div>
                ))}

                {!updatesLoading &&
                  !updatesError &&
                  complaintUpdates.length === 0 && (
                    <p>No admin updates yet.</p>
                  )}
              </div>

              <button
                type="button"
                onClick={() => {
                  void changeArchiveState(
                    complaint.complaintId,
                    false
                  );
                }}
              >
                Restore
              </button>
            </li>
          );
        })}
      </ul>

      <AdminStatusForm />

      <div className="transit-message-box">
        <p>{transitMessage}</p>

        <button
          type="button"
          onClick={() =>
            setTransitMessage(
              "Missed the bus? That's just an unexpected feature."
            )
          }
        >
          New Transit Message
        </button>
      </div>
    </section>
  );
}

export default MyComplaints;