import { useState, useContext } from "react";
import {
  Navbar,
  NavbarContent,
  Link,
  NavbarMenu,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  User,
  DropdownMenu,
  DropdownItem,
  Input,
  Spacer,
} from "@nextui-org/react";
import { ThemeSwitcher } from "../../utils/ThemeSwitcher";
import logodark from "../../assets/sep.png";
import logolight from "../../assets/sep.png";
import useDarkLight from "../../hooks/useDarkLight";
import { useNavigate } from "react-router-dom";
import { ImageContext } from "../../context/ImageContext";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { SearchContext } from "../../context/SearchContext";
import { IoSearch } from "react-icons/io5";

const ProfileAvatar = () => {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  var { profileImage } = useContext(ImageContext);

  //obtener la cookie
  const accessToken = cookie.get("accessToken");
  //decodificar el token
  const decodedToken: any = jwtDecode(accessToken as string);

  const nombres = decodedToken.nombres + " " + decodedToken.apellidos;

  let tipoUsuario = decodedToken.tipoUsuario;
  let isAdmin = decodedToken.isAdmin;

  if (tipoUsuario === "docente" && isAdmin === true) {
    tipoUsuario = "Administrador";
  } else if (tipoUsuario === "docente" && isAdmin === false) {
    tipoUsuario = "Docente";
  } else if (tipoUsuario === "alumno") {
    tipoUsuario = "Alumno";
  }

  const handleNavProfile = () => {
    if (tipoUsuario === "Alumno") {
      navigate("/alumno-perfil");
    } else {
      navigate("/usuario-perfil");
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          name={nombres}
          description={tipoUsuario}
          avatarProps={{
            src: profileImage,
          }}
          as="button"
          className="transition-transform"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem onPress={handleNavProfile} key="profile">
          {t("otros.profile")}
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={() => void logout()}>
          {t("otros.logout")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const Logo = ({ isDark: isDark }: { isDark: boolean }) => {
  const logo = isDark ? logodark : logolight;
  const navigate = useNavigate();

  const handleNavHome = () => {
    navigate("/librosDisponibles");
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
  const { t } = useTranslation();
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
      <NavbarContent className="hidden xl:flex" justify="start">
        <Logo isDark={isDark} />
        <Spacer x={96} />

        <div className="flex items-center">
          {window.location.pathname === "/solicitarLibro" ||
            (window.location.pathname === "/solicitudPrestamos" && (
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
            ))}
        </div>
      </NavbarContent>

      <NavbarContent className="xl:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        Escuela Primaria "Lic. Benito Juárez"
      </NavbarContent>

      <NavbarContent justify="center">
        <div className="hidden sm:flex gap-4">
          <ThemeSwitcher />
        </div>
        <ProfileAvatar />
      </NavbarContent>

      <NavbarMenu>
        <Link className="w-full" size="lg" onPress={handleNavLibrosDisponibles}>
          {t("sidebar.dashboard")}
        </Link>
      </NavbarMenu>
    </Navbar>
  );
};

export default App;
