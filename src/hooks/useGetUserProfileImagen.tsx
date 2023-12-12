import { useEffect, useState, useContext } from "react";
import db from "../services/db";
import defaultImage from "../assets/profile.png";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { ImageContext } from "../context/ImageContext";

const useGetImagenProfile = () => {
  const [imagenPerfil, setImagenPerfil] = useState<string | undefined>(
    undefined
  );
  const { setProfileImage } = useContext(ImageContext);

  useEffect(() => {
    const userToken = Cookies.get("accessToken");
    if (!userToken) {
      setProfileImage(defaultImage);
      setImagenPerfil(defaultImage);
      return;
    }

    const user: any = jwtDecode(userToken);
    const idUser = JSON.parse(user.id);

    const userID = JSON.stringify(idUser);

    const getProfileImage = async () => {
      try {
        if (userID !== undefined) {
          const response = await db.getProfileImage(userID); // Obtener la imagen de perfil del usuario
          const image = response.data; // Obtener el Blob de imagen de la respuesta

          // Crear un objeto URL para la imagen jpeg
          const imageUrl = URL.createObjectURL(image);
          setProfileImage(imageUrl);
          setImagenPerfil(imageUrl); // Actualizar el estado con la URL de la imagen
        } else {
          setProfileImage(defaultImage);
          setImagenPerfil(defaultImage); // Establecer la imagen por defecto si idUsuario es undefined
        }
      } catch (error: any) {
        if (error.response && error.response.status === 500) {
          console.error("No se encontró una imagen de perfil");
        }
        setProfileImage(defaultImage);
        setImagenPerfil(defaultImage);
      }
    };

    getProfileImage();
  }, [setProfileImage]);

  return imagenPerfil;
};

export default useGetImagenProfile;
