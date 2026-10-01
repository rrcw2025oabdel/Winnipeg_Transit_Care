import {useState} from "react";
import "./ViewMyComplaints.module.css";

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

// Dropdown component used to filter complaints by status.
function StatusFilter({
  statusFilter, setStatusFilter,
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
    const [complaints] = useState<Complaint[]>(
      [
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
      description: "The bus was too crowded to allow more passengers.",
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
    (statusFilter === "All" || complaint.status === statusFilter)

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
   
    return(
    
        <section className="my-complaints">
        {/* Status filter */}
      <StatusFilter
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
/>
      <h2>My Complaints</h2>

      <p>Review the complaints you have submitted to Winnipeg Transit Care.</p>

      {/* Active complaints */}
      <ul className="complaint-list">
        {filteredComplaints.map((complaint) => (
          <li key={complaint.complaintId} className="complaint-card">
<button
  type="button"
  onClick={() => archiveComplaint(complaint.complaintId)}
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
          onClick={() => restoreComplaint(complaint.complaintId)}
        >
          Restore
        </button>
      </li>
    ))}
  </ul>
)}
    {/* Shared message that can also be accessed by other components */}
   <div className="transit-message-box">
      <p>{transitMessage}</p>
{/*Button to update the transit message*/}
<button
  onClick={() =>
    setTransitMessage(
      "Missed the bus? That's just an unexpected feature."
    )
  }
>
  New Transit Message
</button> </div>
    </section>
  );
}
export default MyComplaints;