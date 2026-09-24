import CreateComplaint from "./components/features/CreateComplaint/CreateComplaint";
import ViewMyComplaints from "./components/features/ViewMyComplaints/ViewMyComplaints";
import BusRoutes from "./components/features/busroutes/busRoutes";
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import "./App.css";


function App() {
    return (
        <>
            <Header />
            <BusRoutes />
            <CreateComplaint />
            <ViewMyComplaints />
            <Footer />
        </>
    );
}  
export default App;
