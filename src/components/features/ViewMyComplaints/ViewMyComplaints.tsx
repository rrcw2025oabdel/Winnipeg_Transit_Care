import { useState } from "react";

import { currentUserId } from "../../../config/session";

import { complaintStatuses } from "../../../types/complaint";

import { useComplaints } from "../../../hooks/useComplaints";
import { useTransitMessage } from "../../../hooks/useTransitMessage";

import { complaintService } from "../../../services/complaintService";

import AdminStatusForm from "./AdminStatusForm";

import "./ViewMyComplaints.css";

/**
 * Reads the same complaint resource used by CreateComplaint.
 *
 * Archive/restore commands go through complaintService.
 * Only the selected display filter and feedback are local.
 */
function MyComplaints() {
  const {
    complaints,
    loading,
    error: loadError,
  } = useComplaints(currentUserId);

  const {
    transitMessage,
    setTransitMessage,
  } = useTransitMessage();

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [actionError, setActionError] =
    useState("");

  const filteredComplaints =
    complaints.filter(
      (complaint) =>
        !complaint.archived &&
        (
          statusFilter === "All" ||
          complaint.status === statusFilter
        )
    );

  const archivedComplaints =
    complaints.filter(
      (complaint) =>
        complaint.archived
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

      {loading && (
        <p>Loading complaints...</p>
      )}

      {(loadError || actionError) && (
        <p role="alert">
          {loadError || actionError}
        </p>
      )}

      <label htmlFor="status-filter">
        Filter by status
      </label>

      <select
        id="status-filter"
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(
            event.target.value
          )
        }
      >
        <option value="All">
          All
        </option>

        {complaintStatuses.map(
          (status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          )
        )}
      </select>

      <ul className="complaint-list">
        {filteredComplaints.map(
          (complaint) => (
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

              <h3>
                {complaint.title}
              </h3>

              <p>
                <strong>Route:</strong>{" "}
                {complaint.route}
              </p>

              <p>
                {complaint.description}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {complaint.status}
              </p>

              {complaint.latestAdminNote && (
                <p>
                  <strong>Latest admin note:</strong>{" "}
                  {complaint.latestAdminNote}
                </p>
              )}
            </li>
          )
        )}
      </ul>

      {!loading &&
        filteredComplaints.length === 0 && (
          <p>
            No complaints match the selected status.
          </p>
        )}

      <h3>Archived Complaints</h3>

      {archivedComplaints.length === 0 ? (
        <p>No archived complaints.</p>
      ) : (
        <ul>
          {archivedComplaints.map(
            (complaint) => (
              <li
                key={complaint.complaintId}
              >
                {complaint.title}
                {" "}

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
            )
          )}
        </ul>
      )}

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