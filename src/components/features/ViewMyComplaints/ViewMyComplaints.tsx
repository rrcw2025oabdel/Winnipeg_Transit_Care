import { useState } from "react";
import "./ViewMyComplaints.css";

// Props received from the parent component for the shared transit message.
type ViewMyComplaintsProps = {
  transitMessage: string;
  setTransitMessage: (message: string) => void;
};

// Props used by the StatusFilter component.
type statusFilterProps = {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
};

// Defines the structure of a complaint.
interface Complaint {
  complaintId: number;
  userId: number;
  route: string;
  title: string;
  description: string;
  status: string;
}

// Props used by the AdminStatusForm component.
type AdminStatusFormProps = {
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
};

// Dropdown component used to filter complaints by status.
function StatusFilter({
  statusFilter,
  setStatusFilter,
}: statusFilterProps) {
  return (
    <label>
      Filter by status:{" "}
      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="All">All</option>
        <option value="Submitted">Submitted</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>
    </label>
  );
}

// Form component that simulates an admin updating a complaint status.
function AdminStatusForm({
  complaints,
  setComplaints,
}: AdminStatusFormProps) {
  const [selectedComplaintId, setSelectedComplaintId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handles the form submission and validates the input.
  function handleStatusUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    // Validation: complaint must be selected.
    if (selectedComplaintId === "") {
      setError("Please select a complaint.");
      return;
    }

    // Validation: status must be selected.
    if (newStatus === "") {
      setError("Please select a new status.");
      return;
    }

    // Validation: admin note cannot be empty.
    if (adminNote.trim() === "") {
      setError("Please enter an admin note.");
      return;
    }

    // Validation: admin note must contain at least 5 characters.
    if (adminNote.trim().length < 5) {
      setError("Admin note must contain at least 5 characters.");
      return;
    }

    // Updates the selected complaint immediately.
    setComplaints((currentComplaints) =>
      currentComplaints.map((complaint) =>
        complaint.complaintId === Number(selectedComplaintId)
          ? {
              ...complaint,
              status: newStatus,
            }
          : complaint
      )
    );

    setSuccessMessage("Complaint status updated successfully.");

    // Clears the form after a successful update.
    setSelectedComplaintId("");
    setNewStatus("");
    setAdminNote("");
  }

  return (
    <div className="admin-status-form">
      <h3>Admin - Update Complaint Status</h3>

      <form onSubmit={handleStatusUpdate}>
        <div>
          <label htmlFor="complaint">
            Complaint:
          </label>

          <select
            id="complaint"
            value={selectedComplaintId}
            onChange={(event) =>
              setSelectedComplaintId(event.target.value)
            }
          >
            <option value="">Select a complaint</option>

            {complaints.map((complaint) => (
              <option
                key={complaint.complaintId}
                value={complaint.complaintId}
              >
                #{complaint.complaintId} - {complaint.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="newStatus">
            New Status:
          </label>

          <select
            id="newStatus"
            value={newStatus}
            onChange={(event) => setNewStatus(event.target.value)}
          >
            <option value="">Select a status</option>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div>
          <label htmlFor="adminNote">
            Admin Note:
          </label>

          <input
            id="adminNote"
            type="text"
            placeholder="Enter a note about this update"
            value={adminNote}
            onChange={(event) => setAdminNote(event.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        {successMessage && <p>{successMessage}</p>}

        <button type="submit">
          Update Status
        </button>
      </form>
    </div>
  );
}

function MyComplaints({
  transitMessage,
  setTransitMessage,
}: ViewMyComplaintsProps) {
  // Simulates the currently logged-in user.
  const currentUserId = 1;

  // Stores the status currently selected in the filter.
  const [statusFilter, setStatusFilter] = useState("All");

  // Stores the IDs of complaints that the user has archived.
  const [archivedIds, setArchivedIds] = useState<number[]>([]);

  // Adds a complaint ID to the archived complaints list.
  function archiveComplaint(complaintId: number) {
    setArchivedIds((currentIds) => [...currentIds, complaintId]);
  }

  // Sample complaint data.
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      complaintId: 1,
      userId: 1,
      route: "Route 5 - Portage",
      title: "Bus arrived late by 30 minutes",
      description: "The bus arrived approximately 30 minutes late.",
      status: "Submitted",
    },
    {
      complaintId: 2,
      userId: 1,
      route: "Route 15 - Saint Vital",
      title: "Bus did not stop",
      description:
        "The bus passed the stop even though passengers were waiting and did not stop.",
      status: "In Progress",
    },
    {
      complaintId: 3,
      userId: 1,
      route: "Route 16 - Saint boniface",
      title: "Bus did not stop",
      description:
        "The bus passed the stop even though passengers were waiting and did not stop.",
      status: "Resolved",
    },
    {
      complaintId: 4,
      userId: 1,
      route: "Route 10 - North Main",
      title: "Overcrowded bus",
      description:
        "The bus was too crowded to allow more passengers.",
      status: "Resolved",
    },
  ]);

  // Keeps only complaints belonging to the current user.
  const userComplaints = complaints.filter(
    (complaint) => complaint.userId === currentUserId
  );

  // Keeps active complaints and applies the selected status filter.
  const filteredComplaints = userComplaints.filter(
    (complaint) =>
      !archivedIds.includes(complaint.complaintId) &&
      (statusFilter === "All" ||
        complaint.status === statusFilter)
  );

  // Gets complaints that have been archived by the user.
  const archivedComplaints = userComplaints.filter((complaint) =>
    archivedIds.includes(complaint.complaintId)
  );

  // Removes a complaint ID from the archived list.
  function restoreComplaint(complaintId: number) {
    setArchivedIds((currentIds) =>
      currentIds.filter((id) => id !== complaintId)
    );
  }

  return (
    <section className="my-complaints">

      {/* Status filter */}
      <StatusFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <h2>My Complaints</h2>

      <p>
        Review the complaints you have submitted to Winnipeg Transit Care.
      </p>

      {/* Active complaints */}
      <ul className="complaint-list">
        {filteredComplaints.map((complaint) => (
          <li
            key={complaint.complaintId}
            className="complaint-card"
          >
            <button
              type="button"
              onClick={() =>
                archiveComplaint(complaint.complaintId)
              }
            >
              Archive
            </button>

            <h3>{complaint.title}</h3>

            <p>
              <strong>Route:</strong> {complaint.route}
            </p>

            <p>{complaint.description}</p>

            <p>
              <strong>Status:</strong> {complaint.status}
            </p>
          </li>
        ))}
      </ul>

      {/* Message displayed when the selected filter has no results */}
      {filteredComplaints.length === 0 && (
        <p>No complaints match the selected status.</p>
      )}

      {/* Archived complaints */}
      <h3>Archived complaints</h3>

      {archivedComplaints.length === 0 ? (
        <p>No archived complaints.</p>
      ) : (
        <ul>
          {archivedComplaints.map((complaint) => (
            <li key={complaint.complaintId}>
              {complaint.title}{" "}

              <button
                type="button"
                onClick={() =>
                  restoreComplaint(complaint.complaintId)
                }
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Admin form for updating complaint status */}
      <AdminStatusForm
        complaints={complaints}
        setComplaints={setComplaints}
      />

      {/* Shared message that can also be accessed by other components */}
      <div className="transit-message-box">
        <p>{transitMessage}</p>

        {/* Button to update the transit message */}
        <button
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