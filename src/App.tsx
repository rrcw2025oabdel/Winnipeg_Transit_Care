import ViewMyComplaints from "./components/ViewMyComplaints/ViewMyComplaints";
import BusRoutes from "./busroutes/busRoutes";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import "./App.css";


function App() {
    return (
        <>
            <Header />
            <BusRoutes />
            <ViewMyComplaints />
            <Footer />
        </>
    );
}  
export default App;
