import type { Complaint } from "../../../types/complaint";

type ComplaintListProps = {
    complaints: Complaint[];
    setComplaints: (complaints: Complaint[]) => void;
};

function ComplaintList({ complaints, setComplaints }: ComplaintListProps) {
    function handleRemove(id: number) {
        setComplaints(complaints.filter((c) => c.complaintId !== id));
    }

    function handleResolve(id: number) {
        setComplaints(
            complaints.map((c) =>
                c.complaintId === id ? { ...c, status: "resolved" } : c
            )
        );
    }

    if (complaints.length === 0) {
        return (
            <section className="complaint-list">
                <h2>Submitted Complaints</h2>
                <p>No complaints filed yet.</p>
            </section>
        );
    }

    return (
        <section className="complaint-list">
            <h2>Submitted Complaints ({complaints.length})</h2>

            <ul>
                {complaints.map((c) => (
                <li key={c.complaintId}>
                    <h3>{c.title}</h3>
                    <p>
                        <strong>Route:</strong> {c.route}
                    </p>
                    <p>{c.description}</p>
                    <p>
                        <strong>Status:</strong> {c.status}
                    </p>

                    <button type="button" onClick={() => handleResolve(c.complaintId)}>
                        Mark Resolved
                    </button>
                    <button type="button" onClick={() => handleRemove(c.complaintId)}>
                        Remove
                    </button>
                </li>
                ))}
            </ul>
        </section>
    );
}

export default ComplaintList;