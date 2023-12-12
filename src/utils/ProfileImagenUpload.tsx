import React, { useRef, useState, useEffect, useContext } from "react";
import { Avatar } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import db from "../services/db";
import { toast } from "react-toastify";
import { ImageContext } from "../context/ImageContext";
import styles from "./Perfil.module.css";

const ProfileImageUpload = ({
  idUsuario,
  imagenPerfil,
}: {
  idUsuario: string;
  imagenPerfil: string;
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    imagenPerfil
  );
  const { setProfileImage } = useContext(ImageContext);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image change event
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      // Validar el tamaño del archivo (4 MB máximo)
      if (file.size <= 4 * 1024 * 1024) {
        // Validar el tipo de archivo gif, png, jpg, jpeg
        const fileType = file.type;
        if (
          fileType === "image/png" ||
          fileType === "image/jpeg" ||
          fileType === "image/jpg"
        ) {
          const formData = new FormData();
          formData.append("image", file);

          db.uploadProfileImagenDocente(idUsuario.toString(), formData)
            .then(() => {
              toast.success(t("Imagen actualizada"));
              setImagePreview(URL.createObjectURL(file));
              setProfileImage(URL.createObjectURL(file));
            })
            .catch((error: any) => {
              console.error(error);
              toast.error(t("Error al actualizar la imagen"));
            });
        } else {
          // Si el tipo de archivo no es válido, mostrar un mensaje de error
          toast.error(t("Tipo de archivo no válido"));
          console.error("Tipo de archivo no válido" + fileType);
        }
      } else {
        // Si el tamaño del archivo excede los 4 MB, mostrar un mensaje de error
        toast.error(t("Tamaño de archivo excedido"));
        console.error("Tamaño de archivo excedido: " + file.size);
      }
    }
  };

  // Limpiar el campo de archivo al desmontar el componente
  const cleanupFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return cleanupFileInput;
  }, []);

  useEffect(() => {
    setImagePreview(imagenPerfil);
    setProfileImage(imagenPerfil); // Update the profile image in the context
  }, [imagenPerfil, setProfileImage]);

  return (
    <div>
      <Avatar
        className={styles["img"]}
        onClick={handleImageClick}
        as="button"
        src={imagePreview}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ProfileImageUpload;
