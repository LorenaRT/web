import db from "../../../services/db";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useCallback } from "react";

const useGetDocenteData = () => {
  const [docente, setDocente] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setData = (data: any) => {
    const dataDocente = {
      id: data.idDocente,
      nombres: data.nombres,
      apellidos: data.apellidos,
      correoElectronico: data.correoElectronico,
      isAdmin: data.isAdmin,
    };
    return dataDocente;
  };

  const fetchData = useCallback(async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("User access token not found");
      }
      const decoded: any = jwtDecode(token);
      const id = decoded.id;
      const data = await db.getDocenteData(id);
      const docente = data.data;
      const docenteData = setData(docente);

      setDocente(docenteData);
      setIsLoading(false);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setDocente([]);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log(error);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Función para recargar los datos
  const refetchData = () => {
    fetchData();
  };

  return { docente, isLoading, refetchData };
};

export { useGetDocenteData };
