import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import useDarkLight from "../../hooks/useDarkLight";
import { Divider } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { FaBookOpenReader, FaBookAtlas } from "react-icons/fa6";
import { FaBookMedical } from "react-icons/fa";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
interface MenuItemStyleProps {
  level: number;
  active: boolean;
  disabled: boolean;
}
import { PiStudentFill } from "react-icons/pi";
import { FaAddressBook } from "react-icons/fa6";

function SideBar() {
  const { t } = useTranslation();
  const { theme } = useDarkLight();
  const isDark = theme === "dark";
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    localStorage.getItem("isSidebarCollapsed") === "true"
  );
  const [isSidebarPersistCollapsed, setIsSidebarPersistCollapsed] = useState(
    localStorage.getItem("isSidebarPersistCollapsed") === "true"
  );

  const handleLibrosDisponibles = () => {
    if (isMenuItemActive("/librosDisponibles")) {
    } else {
      navigate("/librosDisponibles");
    }
  };

  const handleLibrosEnPrestamo = () => {
    if (isMenuItemActive("/librosPrestamo")) {
    } else {
      navigate("/librosPrestamo");
    }
  };

  const handleAddLibro = () => {
    if (isMenuItemActive("/agregarLibro")) {
    } else {
      navigate("/agregarLibro");
    }
  };

  const handleAlumnos = () => {
    if (isMenuItemActive("/alumnos")) {
    } else {
      navigate("/alumnos");
    }
  };

  const handleSolicitudesPrestamos = () => {
    if (isMenuItemActive("/solicitudPrestamos")) {
    } else {
      navigate("/solicitudPrestamos");
    }
  };
  const isMenuItemActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItemStyles = {
    button: ({ level, active, disabled }: MenuItemStyleProps) => {
      if (level === 0) {
        return {
          color: disabled ? "#eee" : isDark ? "#fff" : "#000000",
          backgroundColor: active ? "#fff" : "transparent",
          "&:hover": {
            backgroundColor: isDark ? "#335B8C" : "#335B8C",
            color: isDark ? "#fff" : "#fff",
            borderRadius: "15px",
          },
        };
      }
    },
  };

  useEffect(() => {
    localStorage.setItem("isSidebarCollapsed", String(isSidebarCollapsed));
    localStorage.setItem(
      "isSidebarPersistCollapsed",
      String(isSidebarPersistCollapsed)
    );
  }, [isSidebarCollapsed, isSidebarPersistCollapsed]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed((prevIsSidebarCollapsed) => !prevIsSidebarCollapsed);
    setIsSidebarPersistCollapsed(
      (prevIsSidebarPersistCollapsed) => !prevIsSidebarPersistCollapsed
    );
  };

  const handleResize = () => {
    if (window.innerWidth < 1280) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(isSidebarPersistCollapsed);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const renderSidebarToggle = () => {
    if (window.innerWidth < 1280) {
      return null;
    }

    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSidebarToggle}
          style={{
            border: "none",
            background: "none",
            marginRight: "25px",
            marginTop: "10px",
            cursor: "pointer",
            fontSize: "30px",
          }}
        >
          {isSidebarCollapsed ? (
            <BsFillArrowRightCircleFill />
          ) : (
            <BsFillArrowLeftCircleFill />
          )}
        </button>
      </div>
    );
  };

  return (
    <>
      <Sidebar
        transitionDuration={300}
        width="270px"
        backgroundColor={isDark ? "dark-mode-sidebar" : "light-mode-sidebar"}
        rootStyles={{
          borderRight: `0.1px  ${isDark ? "#D1D1D1" : "#262626"}`,
          height: "100%",
          //box shadow en modo dark y light
          boxShadow: isDark
            ? "0px 0px 5px rgba(0, 0, 0, 0.5)"
            : "0px 0px 5px rgba(0, 0, 0, 0.3)",
          borderRadius: "8px",
        }}
        collapsed={isSidebarCollapsed}
      >
        {renderSidebarToggle()}

        <Menu menuItemStyles={menuItemStyles} style={{ marginTop: "5%" }}>
          <Divider style={{ height: "0.5px" }} />
          <MenuItem
            style={{ marginTop: "3%" }}
            icon={<FaBookAtlas />}
            title={t("sidebar.librosDisponibles")}
            onClick={handleLibrosDisponibles}
            className={isMenuItemActive("/librosDisponibles") ? "selected" : ""}
          >
            {t("sidebar.librosDisponibles")}
          </MenuItem>

          <MenuItem
            style={{ marginTop: "3%" }}
            icon={<FaBookOpenReader />}
            title={t("sidebar.librosPrestamo")}
            onClick={handleLibrosEnPrestamo}
            className={isMenuItemActive("/librosPrestamo") ? "selected" : ""}
          >
            {t("sidebar.librosPrestamo")}
          </MenuItem>

          <MenuItem
            style={{ marginTop: "3%" }}
            title={t("Solicitudes de Prestamos")}
            icon={<FaAddressBook />}
            onClick={handleSolicitudesPrestamos}
            className={
              isMenuItemActive("/solicitudPrestamos") ? "selected" : ""
            }
          >
            {t("Solicitudes de Prestamos")}
          </MenuItem>

          <MenuItem
            style={{ marginTop: "3%" }}
            icon={<FaBookMedical />}
            title={t("sidebar.agregarLibro")}
            onClick={handleAddLibro}
            className={isMenuItemActive("/agregarLibro") ? "selected" : ""}
          >
            {t("sidebar.agregarLibro")}
          </MenuItem>

          <MenuItem
            style={{ marginTop: "3%" }}
            title={t("Alumnos")}
            icon={<PiStudentFill />}
            onClick={handleAlumnos}
            className={isMenuItemActive("/alumnos") ? "selected" : ""}
          >
            {t("Alumnos")}
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
}

export default SideBar;
