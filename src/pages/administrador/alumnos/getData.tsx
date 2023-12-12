import db from "../../../services/db";
import { useState, useEffect, useCallback } from "react";

const useGetData = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await db.getAllAlumnos();
      setData(res.data);
      setIsLoading(false);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setData([]);
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

  // Función para recargar las notificaciones
  const refetchData = () => {
    fetchData();
  };

  return { data, isLoading, refetchData };
};

export { useGetData };
