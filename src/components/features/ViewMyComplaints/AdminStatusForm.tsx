import {
  useState,
  type FormEvent,
} from "react";

import { currentUserId } from "../../../config/session";

import { complaintStatuses } from "../../../types/complaint";

import { useComplaints } from "../../../hooks/useComplaints";

import { complaintUpdateService } from "../../../services/complaintUpdateService";


/**
 * Uses useComplaints to display shared complaint options.
 *
 * complaintUpdateService validates the admin submission,
 * saves feedback and changes the shared complaint status.
 *
 * This component manages form drafts and displayed feedback.
 */
function AdminStatusForm() {
  const {
    complaints,
    loading,
    error: loadError,
  } = useComplaints(currentUserId);

  const [selectedId, setSelectedId] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [note, setNote] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await complaintUpdateService.create(
        Number(selectedId),
        status,
        note
      );

      setSuccess(
        "Complaint status updated successfully."
      );

      setSelectedId("");
      setStatus("");
      setNote("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to update complaint."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-status-form">
      <h3>
        Admin — Update Complaint Status
      </h3>

      {(error || loadError) && (
        <p role="alert">
          {error || loadError}
        </p>
      )}

      {success && (
        <p role="status">{success}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="admin-complaint">
            Complaint
          </label>

          <select
            id="admin-complaint"
            value={selectedId}
            onChange={(event) =>
              setSelectedId(
                event.target.value
              )
            }
          >
            <option value="">
              Select a complaint
            </option>

            {complaints.map(
              (complaint) => (
                <option
                  key={complaint.complaintId}
                  value={complaint.complaintId}
                >
                  #{complaint.complaintId}
                  {" — "}
                  {complaint.title}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label htmlFor="admin-status">
            New Status
          </label>

          <select
            id="admin-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="">
              Select a status
            </option>

            {complaintStatuses.map(
              (value) => (
                <option
                  key={value}
                  value={value}
                >
                  {value}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label htmlFor="admin-note">
            Admin Note
          </label>

          <input
            id="admin-note"
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
          />
        </div>

        <button
          type="submit"
          disabled={saving || loading}
        >
          {saving
            ? "Saving..."
            : "Update Status"}
        </button>
      </form>
    </div>
  );
}

export default AdminStatusForm;