import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
const initialAccessToken = Cookies.get("accessToken");

// Función para seleccionar la URL basada en la condición de ejecución
function getBaseUrl() {
  const isLocalhost = window.location.hostname === "localhost";

  if (isLocalhost) {
    return "http://localhost:8080/";
  } else {
    return "https://ec2-3-141-197-76.us-east-2.compute.amazonaws.com:8080/";
  }
}

// Crea la instancia de Axios para realizar las peticiones
const instance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
});

// Función para actualizar el encabezado de autorización si el token está disponible
function updateAuthorizationHeader(token: any) {
  if (token) {
    instance.defaults.headers["Authorization"] = `${token}`;
  } else {
    delete instance.defaults.headers["Authorization"];
  }
}

// Actualizar el encabezado de autorización con el token inicial
updateAuthorizationHeader(initialAccessToken);

export default instance;
export { updateAuthorizationHeader };
