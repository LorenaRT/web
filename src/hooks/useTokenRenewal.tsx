import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import service from "../services/db";

interface User {
  id: string;
  nombres: string;
  apellidos: string;
  correoElectronico: string;
  isAdmin: boolean;
  isAlumno: boolean;
  tipoUsuario: string;
}

const useTokenRenewal = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const renewToken = useCallback(async () => {
    // Obtener el token de actualización desde una cookie
    const refreshToken = Cookies.get("refreshToken");

    try {
      // Realizar la solicitud de renovación de token al servidor
      const response = await service.refreshToken(refreshToken);
      const newAccessToken = response.data.accessToken;
      // Duración en minutos
      const accessTokenDurationMinutes = 60;

      // Convertir la duración en días
      const accessTokenDurationDays = accessTokenDurationMinutes / (60 * 24);

      // Establecer la cookie del access token con una duración de 60 minutos
      Cookies.set("accessToken", newAccessToken, {
        expires: accessTokenDurationDays,
      });
      // Decodificar el nuevo token de acceso y obtener los datos del usuario
      const decodedNewAccessToken: any = jwtDecode(newAccessToken);

      // Establecer los datos del usuario en el estado
      const id = decodedNewAccessToken.id;
      const nombres = decodedNewAccessToken.nombres;
      const apellidos = decodedNewAccessToken.apellidos;
      const correoElectronico = decodedNewAccessToken.correoElectronico;
      const isAdmin = decodedNewAccessToken.isAdmin;
      const isAlumno = decodedNewAccessToken.isAlumno;
      const tipoUsuario = decodedNewAccessToken.tipoUsuario;
      const currentUser: User = {
        id: id,
        nombres: nombres,
        apellidos: apellidos,
        correoElectronico: correoElectronico,
        isAdmin: isAdmin,
        isAlumno: isAlumno,
        tipoUsuario: tipoUsuario,
      };
      setUser(currentUser);
    } catch (error) {
      // Error al renovar el token, redireccionar a la página de inicio de sesión
      console.log(error);
    }
  }, [navigate]);

  useEffect(() => {
    const checkSession = async () => {
      // Obtener el token JWT desde una cookie
      const accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        //Eliminar el token de actualización de las cookies
        Cookies.remove("refreshToken");
        return;
      }

      // Decodificar el token JWT para obtener los datos del usuario
      try {
        const decodedAccessToken: any = jwtDecode(accessToken);
        // Renovar el token de acceso si está a 10 minutos de expirar
        if (decodedAccessToken.exp - Date.now() / 1000 < 59 * 60) {
          await renewToken();
        } else {
          // El token de acceso es válido, establecer los datos del usuario
          const currentUser: User = {
            id: decodedAccessToken.id,
            nombres: decodedAccessToken.nombres,
            apellidos: decodedAccessToken.apellidos,
            correoElectronico: decodedAccessToken.correoElectronico,
            isAdmin: decodedAccessToken.isAdmin,
            isAlumno: decodedAccessToken.isAlumno,
            tipoUsuario: decodedAccessToken.tipoUsuario,
          };
          setUser(currentUser);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkSession();
  }, [navigate, renewToken]);

  return user;
};

export default useTokenRenewal;
