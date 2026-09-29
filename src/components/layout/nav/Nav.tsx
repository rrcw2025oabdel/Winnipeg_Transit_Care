import { NavLink } from "react-router-dom";

import styles from "./Nav.module.css";

function Nav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/routes">Bus Routes</NavLink>

      <NavLink to="/complaints/new">
        Create Complaint
      </NavLink>

      <NavLink to="/complaints">
        My Complaints
      </NavLink>
    </nav>
  );
}

export default Nav;