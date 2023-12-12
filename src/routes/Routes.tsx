import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import { ImageProvider } from "../context/ImageContext";
import { SearchContextProvider } from "../context/SearchContext";
import { FilterContextProvider } from "../context/BookFilterContext";

import "react-toastify/dist/ReactToastify.css";
import "./toastify.css";

import {
  DocenteElements,
  AlumnoElements,
  AdministradorElements,
} from "./Vistas";

//Rutas Publicas
import Login from "../pages/general/login/Page";

//Rutas Profesor
import LibrosDisponibles from "../pages/docentes/librosDisponibles/Page";
import AgregarLibro from "../pages/docentes/agregarLibro/Page";
import LibrosEnPrestamo from "../pages/docentes/librosEnPrestamo/Page";
import SolicitudPrestamo from "../pages/docentes/solicitudPrestamos/Page";

//Rutas Alumno
import MainAlumno from "../pages/alumnos/home/Page";
import AlumnoPerfil from "../pages/alumnos/perfil/Page";
import SolicitarLibro from "../pages/alumnos/solicitarLibro/Page";

//Rutas Administrador
import MainAdministrador from "../pages/administrador/home/Page";
import AddDocente from "../pages/administrador/agregarDocente/Page";
import Profile from "../pages/administrador/perfil/Page";
import Alumnos from "../pages/administrador/alumnos/Page";

//Rutas Publicas
import Home from "../pages/home/Page";
function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchContextProvider>
          <FilterContextProvider>
            <ImageProvider>
              <ToastContainer position="bottom-right" />
              <Routes>
                {/* Elementos Publicos */}
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />

                {/* Elementos Profesor */}
                <Route
                  path="/librosDisponibles"
                  element={
                    <DocenteElements>
                      <LibrosDisponibles />
                    </DocenteElements>
                  }
                />

                <Route
                  path="/solicitudPrestamos"
                  element={
                    <DocenteElements>
                      <SolicitudPrestamo />
                    </DocenteElements>
                  }
                />

                <Route
                  path="/agregarLibro"
                  element={
                    <DocenteElements>
                      <AgregarLibro />
                    </DocenteElements>
                  }
                />

                <Route
                  path="/librosPrestamo"
                  element={
                    <DocenteElements>
                      <LibrosEnPrestamo />
                    </DocenteElements>
                  }
                />

                <Route
                  path="/usuario-perfil"
                  element={
                    <DocenteElements>
                      <Profile />
                    </DocenteElements>
                  }
                />

                <Route
                  path="/alumnos"
                  element={
                    <DocenteElements>
                      <Alumnos />
                    </DocenteElements>
                  }
                />

                {/* Elementos Alumno */}
                <Route
                  path="/alumno-main"
                  element={
                    <AlumnoElements>
                      <MainAlumno />
                    </AlumnoElements>
                  }
                />

                <Route
                  path="/solicitarLibro"
                  element={
                    <AlumnoElements>
                      <SolicitarLibro />
                    </AlumnoElements>
                  }
                />

                <Route
                  path="/alumno-perfil"
                  element={
                    <AlumnoElements>
                      <AlumnoPerfil />
                    </AlumnoElements>
                  }
                />

                {/* Elementos Administrador */}
                <Route
                  path="/administrador-main"
                  element={
                    <AdministradorElements>
                      <MainAdministrador />
                    </AdministradorElements>
                  }
                />

                <Route
                  path="/agregarDocente"
                  element={
                    <AdministradorElements>
                      <AddDocente />
                    </AdministradorElements>
                  }
                />

                <Route
                  path="/solicitudPrestamos"
                  element={
                    <AdministradorElements>
                      <SolicitudPrestamo />
                    </AdministradorElements>
                  }
                />

                <Route
                  path="/usuario-perfil"
                  element={
                    <AdministradorElements>
                      <Profile />
                    </AdministradorElements>
                  }
                />

                <Route
                  path="/alumnos"
                  element={
                    <AdministradorElements>
                      <Alumnos />
                    </AdministradorElements>
                  }
                />

                <Route
                  path="/librosPrestamo"
                  element={
                    <AdministradorElements>
                      <LibrosEnPrestamo />
                    </AdministradorElements>
                  }
                />
              </Routes>
            </ImageProvider>
          </FilterContextProvider>
        </SearchContextProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
