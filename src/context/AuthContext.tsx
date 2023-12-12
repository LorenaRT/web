import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useTokenRenewal from "../hooks/useTokenRenewal";
import { updateAuthorizationHeader } from "../api/axios";

interface AuthContextData {
  isAuthenticated: boolean;
  logout: () => void;
  login: (accessToken: string, refreshToken: string) => void;
}

export const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  logout: () => { },
  login: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  useTokenRenewal();

  // Function to logout the user by clearing cookies and redirecting to login
  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Funcion para iniciar sesión del usuario
  const login = (accessToken: string, refreshToken: string) => {
    // Duración en minutos
    const accessTokenDurationMinutes = 60;
    const refreshTokenDurationMinutes = 20 * 60; // 20 horas en minutos

    // Convertir la duración en días
    const accessTokenDurationDays = accessTokenDurationMinutes / (60 * 24);
    const refreshTokenDurationDays = refreshTokenDurationMinutes / (60 * 24);

    // Establecer la cookie del access token con una duración de 55 minutos
    Cookies.set("accessToken", accessToken, {
      expires: accessTokenDurationDays,
    });

    // Establecer la cookie del refresh token con una duración de 20 horas
    Cookies.set("refreshToken", refreshToken, {
      expires: refreshTokenDurationDays,
    });

    //obtener el tipo de usuario de la token
    const decodedNewAccessToken: any = jwtDecode(accessToken);
    const idUsuario = decodedNewAccessToken.id;

    //guardar en el localStorage
    localStorage.setItem("idUsuario", idUsuario);
    updateAuthorizationHeader(Cookies.get("accessToken"));
    setIsAuthenticated(true);
    // Redirigir al usuario a la página de inicio
    //dependiendo del usuario navegar a un lado u otro
    const tipoUsuario = decodedNewAccessToken.tipoUsuario;

    if (tipoUsuario === "docente") navigate("/librosDisponibles")
    else if (tipoUsuario === "alumno") navigate("/alumno-main");
    else
      navigate("/");
  };

  // Check if user is authenticated using the access token stored in cookies
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      updateAuthorizationHeader(undefined);
      setIsAuthenticated(false);
      return;
    }

    if (accessToken) {
      const decodedNewAccessToken: any = jwtDecode(accessToken);

      // Obtener la fecha de expiración del token
      const { exp } = decodedNewAccessToken;

      // Obtener la fecha actual en segundos
      const currentTimestamp = Date.now() / 1000;

      // Verificar si el token no ha expirado
      if (exp > currentTimestamp) {
        setIsAuthenticated(true);
      } else {
        // Si el token ha expirado, borrar las cookies y establecer el estado de autenticación en false
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        updateAuthorizationHeader(undefined);
        setIsAuthenticated(false);
        // Redirigir al usuario a la página de inicio de sesión
      }
    }

    // Después de verificar el estado de autenticación, establecer isLoading en false
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
