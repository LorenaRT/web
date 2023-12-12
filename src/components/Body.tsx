import React from "react";
import Footer from "../components/footer/Footer";
import SidebarDocente from "./sidebar/SidebarDocente";
import SidebarAlumnos from "./sidebar/SidebarAlumnos";
import SidebarAdministrador from "./sidebar/SidebarAdministrador";
import Navbar from "./navbar/Navbar";
import useGetProfileImage from "../hooks/useGetUserProfileImagen";
import cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface BodyProps {
  children: React.ReactNode;
}
import styles from "./Body.module.css";

const Body: React.FC<BodyProps> = ({ children }) => {
  const image = useGetProfileImage();

  console.log(image);

  //obtener el tipo de usuario
  //obtener el token del cookie
  const accessToken = cookie.get("accessToken");
  //decodificar el token
  const decodedToken: any = jwtDecode(accessToken as string);
  const tipoUsuario = decodedToken.tipoUsuario;
  const userType = tipoUsuario;
  const isAdmin = JSON.parse(decodedToken.isAdmin);

  return (
    <div className={styles["layout"]}>
      <div className={styles["navbar"]}>
        <Navbar />
      </div>

      <div className={styles["SidebarProfesor"]}>
        {userType === "docente" && isAdmin === false && <SidebarDocente />}
        {userType === "alumno" && <SidebarAlumnos />}
        {userType === "docente" && isAdmin === true && <SidebarAdministrador />}
      </div>

      <div className={styles["body"]}>{children}</div>

      <div className={styles["footer"]}>
        <Footer />
      </div>
    </div>
  );
};

export default Body;
