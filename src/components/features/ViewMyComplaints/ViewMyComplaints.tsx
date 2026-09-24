type ViewMyComplaintsProps = {
  transitMessage: string;
  setTransitMessage: (message: string) => void;
};

interface Complaint {
  complaintId: number;
  userId: number;
  route: string;
  title: string;
  description: string;
  status: string;
}

function MyComplaints({
  transitMessage,
  setTransitMessage,
}: ViewMyComplaintsProps) {
    const currentUserId = 1;
    
    const complaints: Complaint[] =[
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
      userId: 2,
      route: "Route 10 - North Main",
      title: "Overcrowded bus",
      description: "The bus was too crowded to allow more passengers.",
      status: "Resolved",
    },
      
    ];

    const userComplaints = complaints.filter(
        (complaint) => complaint.userId === currentUserId
    );

    return(
        <section className="my-complaints">
      <h2>My Complaints</h2>

      <p>Review the complaints you have submitted to Winnipeg Transit Care.</p>

      <ul className="complaint-list">
        {userComplaints.map((complaint) => (
          <li key={complaint.complaintId} className="complaint-card">
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
</button>
    </section>
  );
}
export default MyComplaints;