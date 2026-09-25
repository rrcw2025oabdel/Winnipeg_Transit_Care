import styles from "./Footer.module.css";

function Footer() {
    return (
        <footer className={styles.footer}>
            <p> Team Members </p>
            <ul className={styles.teamMembers}>
                <li>Aubrey Fernandez</li>
                <li>Abdelhamid Oughanem</li>
                <li>Keith Robles</li>
            </ul>        
        </footer>
    )
}

export default Footer;