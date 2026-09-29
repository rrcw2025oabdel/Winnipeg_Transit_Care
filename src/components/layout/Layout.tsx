import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import styles from "./Layout.module.css";
import Nav from "./nav/Nav";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <Nav />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}