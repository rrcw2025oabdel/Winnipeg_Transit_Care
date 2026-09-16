interface Complaint {
    complaintId: number;
    userId: number;
    route: string;
    title: string;
    description: string;
    status: string;
}

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

type NewComplaint = Omit<Complaint, "complaintId" | "status">;

interface CreateComplaintProperties {
    currentUserId?: number;
    onSubmit?: (complaint: NewComplaint) => void;
}

function CreateComplaint(props: CreateComplaintProperties) {
    let currentUserId = props.currentUserId;
    if (currentUserId === undefined) {
        currentUserId = 0;
    }
 
    function handleFormSubmission(complaint: NewComplaint) {
        if (props.onSubmit) {
            props.onSubmit(complaint);
        } else {
            console.log("New complaint submitted:", complaint);
        }
    }
 
    const [routeId, setRouteId] = useState<string>(availableRoutes[0].id);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [confirmationMessage, setConfirmationMessage] = useState<string>("");
    
    function handleSubmit(event: FormEvent<HTMLFormElement>) {    
        const newComplaint: NewComplaint = {
            userId: currentUserId,
            route: routeId,
            title: title.trim(),
            description: description.trim(),
        };
    
        handleFormSubmission(newComplaint);
    
        setConfirmationMessage("Complaint \"" + newComplaint.title + "\" submitted.");
    }
 
    return (
        <section className="create-complaint">
            <h2>File a Complaint</h2>
 
            <form onSubmit={handleSubmit}>
                <div className="create-complaint__field">
                    <label htmlFor="complaint-route">Route</label>
                    <select
                        id="complaint-route"
                        value={routeId}
                        onChange={(event) => setRouteId(event.target.value)}
                        required
                    >
                        {availableRoutes.map((route) => {
                            return (
                                <option key={route.id} value={route.id}>
                                    {route.id} - {route.name}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="create-complaint__field">
                    <label htmlFor="complaint-title">Title</label>
                    <input
                        id="complaint-title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                        maxLength={80}
                    />
                </div>

                <div className="create-complaint__field">
                    <label htmlFor="complaint-description">Description</label>
                    <textarea
                        id="complaint-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                        rows={5}
                    />
                </div>

                <button type="submit">Submit Complaint</button>
            </form>
 
            {confirmationMessage !== "" && (
                <p className="create-complaint__confirmation" role="status">
                    {confirmationMessage}
                </p>
            )}
        </section>
    );
}
 
export default CreateComplaint;