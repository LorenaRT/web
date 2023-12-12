import { useState, useEffect, useContext } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import useDarkLight from "../../hooks/useDarkLight";
import { Divider, RadioGroup, Radio, ScrollShadow } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { FaBookOpenReader, FaBookAtlas } from "react-icons/fa6";
import { FaBookMedical } from "react-icons/fa";
import { FilterContext } from "../../context/BookFilterContext";
import { useGetData } from "../../pages/home/getData";

import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
interface MenuItemStyleProps {
  level: number;
  active: boolean;
  disabled: boolean;
}

function SideBar() {
  const { t } = useTranslation();
  const { theme } = useDarkLight();
  const isDark = theme === "dark";
  const { setFilter, filter } = useContext(FilterContext);
  const { data } = useGetData();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    localStorage.getItem("isSidebarCollapsed") === "true"
  );
  const [isSidebarPersistCollapsed, setIsSidebarPersistCollapsed] = useState(
    localStorage.getItem("isSidebarPersistCollapsed") === "true"
  );

  const [isSubMenuAutorOpen, setSubMenuAutor] = useState(
    localStorage.getItem("isSubMenuAutorOpen") === "true"
  );

  const [isSubMenuEditorialOpen, setSubMenuEditorial] = useState(
    localStorage.getItem("isSubMenuEditorialOpen") === "true"
  );

  const [isSubMenuGeneroOpen, setSubMenuGenero] = useState(
    localStorage.getItem("isSubMenuGeneroOpen") === "true"
  );

  const handleSubMenuAutor = () => {
    setSubMenuAutor(!isSubMenuAutorOpen);
  };

  const handleSubMenuEditorial = () => {
    setSubMenuEditorial(!isSubMenuEditorialOpen);
  };

  const handleSubMenuGenero = () => {
    setSubMenuGenero(!isSubMenuGeneroOpen);
  };

  const menuItemStyles = {
    button: ({ level, active, disabled }: MenuItemStyleProps) => {
      if (level === 0) {
        return {
          color: disabled ? "#eee" : isDark ? "#fff" : "#000000",
          backgroundColor: active ? "#fff" : "transparent",
          "&:hover": {
            backgroundColor: isDark ? "#727272;" : "#727272",
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

        <ScrollShadow
          size={10}
          style={{ overflowY: "auto", maxHeight: "82vh" }}
        >
          <Menu menuItemStyles={menuItemStyles} style={{ marginTop: "5%" }}>
            <Divider style={{ height: "0.5px" }} />

            {filter.value === "" ? (
              <p style={{ marginTop: "5%", textAlign: "center" }}>
                {t("Filtrar por")}
              </p>
            ) : (
              <MenuItem
                style={{ marginTop: "5%", textAlign: "center", color: "red" }}
                onClick={() => {
                  setFilter("", "");
                }}
              >
                {t("Limpiar Filtro")}
              </MenuItem>
            )}

            <SubMenu
              style={{ marginTop: "5%" }}
              label={t("Autor")}
              title={t("Autor")}
              className="custom-submenu"
              open={isSubMenuAutorOpen}
              onOpenChange={handleSubMenuAutor}
              icon={<FaBookAtlas />}
            >
              <RadioGroup
                color="primary"
                value={filter.type === "Autor" ? filter.value : ""}
              >
                {data
                  .filter((book: any, index: number, self: any) => {
                    return (
                      index ===
                      self.findIndex(
                        (b: any) =>
                          b.autor.toLowerCase() === book.autor.toLowerCase()
                      )
                    );
                  })
                  .map((book: any) => (
                    <MenuItem key={book.idLibro}>
                      <Radio
                        value={book.autor}
                        onChange={(e) => {
                          setFilter("Autor", e.target.value);
                        }}
                      >
                        {book.autor.charAt(0).toUpperCase() +
                          book.autor.slice(1)}
                      </Radio>
                    </MenuItem>
                  ))}
              </RadioGroup>
            </SubMenu>

            <SubMenu
              style={{ marginTop: "5%" }}
              label={t("Editorial")}
              title={t("Editorial")}
              className="custom-submenu"
              open={isSubMenuEditorialOpen}
              onOpenChange={handleSubMenuEditorial}
              icon={<FaBookOpenReader />}
            >
              <RadioGroup
                color="primary"
                value={filter.type === "Editorial" ? filter.value : ""}
              >
                {data
                  .filter((book: any, index: number, self: any) => {
                    return (
                      index ===
                      self.findIndex(
                        (b: any) =>
                          b.editorial.toLowerCase() ===
                          book.editorial.toLowerCase()
                      )
                    );
                  })
                  .map((book: any) => (
                    <MenuItem key={book.idLibro}>
                      <Radio
                        value={book.editorial}
                        onChange={(e) => {
                          setFilter("Editorial", e.target.value);
                        }}
                      >
                        {book.editorial.charAt(0).toUpperCase() +
                          book.editorial.slice(1)}
                      </Radio>
                    </MenuItem>
                  ))}
              </RadioGroup>
            </SubMenu>

            <SubMenu
              style={{ marginTop: "5%" }}
              label={t("Genero")}
              title={t("Genero")}
              className="custom-submenu"
              open={isSubMenuGeneroOpen}
              onOpenChange={handleSubMenuGenero}
              icon={<FaBookMedical />}
            >
              <RadioGroup
                color="primary"
                value={filter.type === "Genero" ? filter.value : ""}
              >
                {data
                  .filter((book: any, index: number, self: any) => {
                    return (
                      index ===
                      self.findIndex(
                        (b: any) =>
                          b.genero.toLowerCase() === book.genero.toLowerCase()
                      )
                    );
                  })
                  .map((book: any) => (
                    <MenuItem key={book.idLibro}>
                      <Radio
                        value={book.genero}
                        onChange={(e) => {
                          setFilter("Genero", e.target.value);
                        }}
                      >
                        {book.genero.charAt(0).toUpperCase() +
                          book.genero.slice(1)}
                      </Radio>
                    </MenuItem>
                  ))}
              </RadioGroup>
            </SubMenu>
          </Menu>
        </ScrollShadow>
      </Sidebar>
    </>
  );
}

export default SideBar;
