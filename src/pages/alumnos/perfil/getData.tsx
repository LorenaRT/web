import db from "../../../services/db";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useCallback } from "react";

const useGetDataAlumno = () => {
  const [alumno, setDocente] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("User access token not found");
      }
      const decoded: any = jwtDecode(token);
      const id = decoded.id;
      const data = await db.getAlumnoData(id);
      const alumno = data.data;

      setDocente(alumno);
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

  return { alumno, isLoading, refetchData };
};

export { useGetDataAlumno };
