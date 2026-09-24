import {Routes,Route} from "react-router-dom";
import CreateComplaint from "./components/features/CreateComplaint/CreateComplaint";
import ViewMyComplaints from "./components/features/ViewMyComplaints/ViewMyComplaints";
import BusRoutes from "./components/features/busroutes/busRoutes";
import Layout from "./components/layout/Layout";
import "./App.css";


function App() {
    return (
        <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<BusRoutes />} />
        <Route path="/routes" element={<BusRoutes />} />
        <Route path="/complaints/new" element={<CreateComplaint />} />
        <Route path="/complaints" element={<ViewMyComplaints />} />
      </Route>
    </Routes>
    );
}
            
export default App;
