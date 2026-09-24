import {useState} from "react";
import {Routes,Route} from "react-router-dom";
import CreateComplaint from "./components/features/CreateComplaint/CreateComplaint";
import ViewMyComplaints from "./components/features/ViewMyComplaints/ViewMyComplaints";
import BusRoutes from "./components/features/busroutes/busRoutes";
import Layout from "./components/layout/Layout";
import "./App.css";


function App() {
    const [transitMessage, setTransitMessage] = useState(
        "Welcome aboard! Please keep your code behind the yellow line."
    );
    return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <BusRoutes
              transitMessage={transitMessage}
              setTransitMessage={setTransitMessage}
            />
          }
        />

        <Route
          path="/routes"
          element={
            <BusRoutes
              transitMessage={transitMessage}
              setTransitMessage={setTransitMessage}
            />
          }
        />

        <Route
          path="/complaints/new"
          element={
            <CreateComplaint
              transitMessage={transitMessage}
              setTransitMessage={setTransitMessage}
            />
          }
        />

        <Route
          path="/complaints"
          element={
            <ViewMyComplaints
              transitMessage={transitMessage}
              setTransitMessage={setTransitMessage}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;