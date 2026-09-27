import { useState } from "react";
import type { Complaint } from "../../../types/complaint";

type CreateComplaintProps = {
  userId: number;
  complaints: Complaint[];
  setComplaints: (complaints: Complaint[]) => void;
  transitMessage: string;
  setTransitMessage: (message: string) => void;
};

const availableRoutes: string[] = [
  "BLUE - Unicity Mall / University of Manitoba",
  "FX2 - Main / St. Mary's",
  "FX3 - Regent / Grant",
  "FX4 - Gateway / Portage",
  "F5 - McPhillips / Donald",
  "F6 - McGregor / Osborne",
  "F7 - St. Anne's / Provencher",
  "F8 - Henderson / Pembina",
  "F9 - Lagimodiere / Abinojii Mikanah",
];

function CreateComplaint({
  userId,
  complaints,
  setComplaints,
  transitMessage,
  setTransitMessage,
}: CreateComplaintProps) {
  const [route, setRoute] = useState(availableRoutes[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [latestComplaint, setLatestComplaint] = useState<Complaint | null>(
    null
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    const newComplaint: Complaint = {
      complaintId:
        complaints.length > 0
          ? Math.max(...complaints.map((c) => c.complaintId)) + 1
          : 1,
      userId,
      route,
      title,
      description,
      status: "open",
    };

    setComplaints([...complaints, newComplaint]);
    setLatestComplaint(newComplaint);

    setTitle("");
    setDescription("");
    setRoute(availableRoutes[0]);
  }

  function handleCancel() {
    if (!latestComplaint) return;
    setComplaints(
      complaints.filter((c) => c.complaintId !== latestComplaint.complaintId)
    );
    setLatestComplaint(null);
  }

  return (
    <section className="create-complaint">
      <h2>File a Complaint</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="complaint-route">Bus Route</label>
          <select
            id="complaint-route"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            required
          >
            {availableRoutes.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="complaint-title">Title</label>
          <input
            id="complaint-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="complaint-description">Description</label>
          <textarea
            id="complaint-description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Complaint</button>
      </form>

      <div className="complaint-preview">
        <h3>Preview</h3>
        <p>
          <strong>Route:</strong> {route}
        </p>
        <p>
          <strong>Title:</strong> {title || "(untitled)"}
        </p>
        <p>
          <strong>Description:</strong> {description || "(no description yet)"}
        </p>
      </div>

      {latestComplaint && (
        <div className="latest-complaint">
          <h3>Latest Complaint Filed</h3>
          <p>
            <strong>{latestComplaint.title}</strong> — {latestComplaint.route}
          </p>
          <p>{latestComplaint.description}</p>
          <p>
            <strong>Status:</strong> {latestComplaint.status}
          </p>
          <button type="button" onClick={handleCancel}>
            Cancel Complaint
          </button>
        </div>
      )}

      <p>{transitMessage}</p>

      <button
        type="button"
        onClick={() =>
          setTransitMessage("Bus delayed due to a bug in production.")
        }
      >
        New Transit Message
      </button>
    </section>
  );
}

export default CreateComplaint;