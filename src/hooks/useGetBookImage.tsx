import { useEffect, useState, useCallback } from "react";
import db from "../services/db";
import defaultImage from "../assets/defaultBook.png";

const useGetBookImage = (idLibro: any | undefined) => {
  const [imagenPerfil, setImagenLibro] = useState<string | undefined>(
    undefined
  );

  const getImagenLibro = useCallback(async () => {
    try {
      if (idLibro !== undefined) {
        const response = await db.getBookImage(idLibro);
        const image = response.data;
        const imageUrl = URL.createObjectURL(image);
        setImagenLibro(imageUrl);
      } else {
        setImagenLibro(defaultImage);
      }
    } catch (error: any) {
      if (error.message === "Request failed with status code 500") {
        console.log("No se encontró la imagen del libro");
      }
      setImagenLibro(defaultImage);
    }
  }, [idLibro]);

  useEffect(() => {
    getImagenLibro();
  }, [idLibro, getImagenLibro]);
  return imagenPerfil;
};

export default useGetBookImage;
