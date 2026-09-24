type CreateComplaintProps = {
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
  transitMessage,
  setTransitMessage,
}: CreateComplaintProps) {
  return (
    <section className="create-complaint">
      <h2>File a Complaint</h2>

      <form>
        <div>
          <label htmlFor="complaint-route">
            Bus Route
          </label>

          <select id="complaint-route" required>
            {availableRoutes.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="complaint-title">
            Title
          </label>

          <input
            id="complaint-title"
            type="text"
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
            required
          />
        </div>

        <button type="submit">
          Submit Complaint
        </button>
      </form>
      <p>{transitMessage}</p>
{/*Button to update the transit message*/}
<button
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