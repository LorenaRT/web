import { useState, useContext } from "react";
import {
  Navbar,
  NavbarContent,
  Link,
  NavbarMenu,
  NavbarMenuToggle,
  Button,
  Input,
  Spacer,
} from "@nextui-org/react";
import { ThemeSwitcher } from "../../utils/ThemeSwitcher";
import logodark from "../../assets/sep.png";
import logolight from "../../assets/sep.png";
import useDarkLight from "../../hooks/useDarkLight";
import { useNavigate } from "react-router-dom";
import { BiSolidUser } from "react-icons/bi";
import { SearchContext } from "../../context/SearchContext";
import { IoSearch } from "react-icons/io5";

const Logo = ({ isDark: isDark }: { isDark: boolean }) => {
  const logo = isDark ? logodark : logolight;
  const navigate = useNavigate();

  const handleNavHome = () => {
    navigate("/");
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginRight: "0px",
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{ maxWidth: "90px", minWidth: "90px", cursor: "pointer" }}
        onClick={handleNavHome}
      />
      <p
        style={{
          marginLeft: "10px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "bold",
          marginTop: "2px",
        }}
        onClick={handleNavHome}
      >
        Escuela Primaria "Lic. Benito Juárez"
      </p>
    </div>
  );
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<any>(false);
  const { theme } = useDarkLight();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  const handleNavLibrosDisponibles = () => {
    navigate("/librosDisponibles");
  };

  return (
    <Navbar
      height="60px"
      isBordered
      isBlurred={false}
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent
        className="flex items-center justify-between xl:flex"
        justify="start"
      >
        <Logo isDark={isDark} />
        <Spacer x={96} />

        <div className="flex items-center">
          {window.location.pathname === "/" && (
            <>
              <Input
                isClearable
                type="string"
                size="sm"
                value={searchTerm}
                onClear={() => setSearchTerm("")}
                placeholder="Buscar"
                className="max-w-xs"
                startContent={<IoSearch size={24} />}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </>
          )}
        </div>
      </NavbarContent>

      <NavbarContent className="xl:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent justify="center">
        <ThemeSwitcher />
        <Button
          style={{ backgroundColor: "transparent" }}
          startContent={<BiSolidUser />}
          onPress={() => navigate("/login")}
        >
          Iniciar Sesion / Registrarse
        </Button>
      </NavbarContent>

      <NavbarMenu>
        <Link className="w-full" size="lg" onPress={handleNavLibrosDisponibles}>
          {/* {t("sidebar.dashboard")} */}
        </Link>
      </NavbarMenu>
    </Navbar>
  );
};

export default App;
