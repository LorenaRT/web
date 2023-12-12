import React from "react";
import Footer from "./footer/Footer";
import SideBarPublic from "./sidebar/SidebarPublic";
import Navbar from "./navbar/PublicNavbar";

interface BodyProps {
  children: React.ReactNode;
}
import styles from "./Body.module.css";

const Body: React.FC<BodyProps> = ({ children }) => {
  return (
    <div className={styles["layout"]}>
      <div className={styles["navbar"]}>
        <Navbar />
      </div>

      {/* //si la ruta no es /login o /register, se muestra el sidebar */}
      <div className={styles["sidebar"]}>
        {window.location.pathname !== "/login" &&
        window.location.pathname !== "/register" ? (
          <SideBarPublic />
        ) : null}
      </div>

      <div className={styles["body"]}>{children}</div>

      <div className={styles["footer"]}>
        <Footer />
      </div>
    </div>
  );
};

export default Body;
