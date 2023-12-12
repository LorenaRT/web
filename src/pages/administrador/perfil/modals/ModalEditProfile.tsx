import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Input,
  Spacer,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import styles from "./ModalUserInfo.module.css";
import ProfileImageUpload from "../../../../utils/ProfileImagenUpload";
import { ImageContext } from "../../../../context/ImageContext";
import db from "../../../../services/db";
import { toast } from "react-toastify";

interface InfoUserProps {
  onClose: any;
  usuario: any;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({ onClose, usuario }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  var { profileImage } = useContext(ImageContext);

  const closeHandler = (response: any) => {
    setVisible(false);
    onClose(response);
  };

  const [newNombre, setNewNombre] = useState<any>("");
  const [newApellido, setNewApellido] = useState<any>("");

  const [errorNombre, setErrorNombre] = useState<any>("");
  const [errorApellido, setErrorApellido] = useState<any>("");
  useState<any>("");

  //settear los valores de los inputs
  useEffect(() => {
    setNewNombre(usuario.nombres);
    setNewApellido(usuario.apellidos);
  }, []);

  //Validar que el nombre tenga pura letras y no este vacio
  const validateNombre = (nombre: string) => {
    if (nombre === "") {
      return false;
    }
    if (!/^[a-zA-Z ]+$/.test(nombre)) {
      return false;
    }
    return true;
  };

  if (!profileImage) {
    return null;
  }

  const verifyErrors = () => {
    // Objeto para almacenar los mensajes de error
    const errors = {
      nombreError: "",
      apellidoError: "",
    };

    // Limpia los mensajes de error previos
    setErrorNombre;
    setErrorApellido("");

    if (newNombre === "") {
      errors.nombreError = t("otros.nombreRequerido");
    } else if (!validateNombre(newNombre)) {
      errors.nombreError = t("otros.soloLetras");
    }

    if (newApellido === "") {
      errors.apellidoError = t("otros.apellidoRequerido");
    } else if (!validateNombre(newApellido)) {
      errors.apellidoError = t("otros.soloLetras");
    }

    // Asigna los mensajes de error
    setErrorNombre(errors.nombreError);
    setErrorApellido(errors.apellidoError);

    //si no hay errores, se llama a la función handleLogin
    if (errors.nombreError === "" && errors.apellidoError === "") {
      handleUpdate();
    }
  };

  const handleUpdate = async () => {
    try {
      const id = usuario.id;
      const nombres = newNombre.toString();
      const apellidos = newApellido.toString();

      const data = {
        id,
        nombres,
        apellidos,
      };

      const response = await db.updateDocente(data);
      if (
        response.status === 200 &&
        response.data.message === "Docente actualizado correctamente."
      ) {
        closeHandler("success");
      }
    } catch (error: any) {
      if (error.response.data.message === "Error al actualizar los datos.") {
        toast.error(t("otros.errorActualizarDatos"));
      }
    }
  };

  return (
    <Modal
      size="md"
      isOpen={visible}
      aria-labelledby="modal-signup"
      onClose={closeHandler as any}
      backdrop="blur"
      isDismissable={false}
      scrollBehavior="inside"
      placement="auto"
    >
      <ModalContent>
        <>
          <ModalHeader className={styles["header"]}>
            {t("Información del Docente")}
            <div className={styles["avatar"]}>
              <ProfileImageUpload
                idUsuario={usuario.id}
                imagenPerfil={profileImage}
              />
            </div>
          </ModalHeader>
          <ModalBody className={styles["body"]}>
            <div className={styles["card-data"]}>
              <div className={styles["flex-title"]}>
                <p className="text-small text-default-500">{t("Nombres")}</p>
                <Spacer x={16} />
                <p className="text-small text-default-500">{t("Apellidos")}</p>
              </div>

              <div className={styles["flex-double"]}>
                <Input
                  onValueChange={setNewNombre}
                  errorMessage={errorNombre}
                  value={newNombre}
                  className="text-md "
                ></Input>

                <Input
                  onValueChange={setNewApellido}
                  errorMessage={errorApellido}
                  value={newApellido}
                  className="text-md"
                ></Input>
              </div>
            </div>

            <div className={styles["card-data"]}>
              <p className="text-small text-default-500">
                {t("Correo electrónico")}
              </p>
              <p className="text-md">{usuario.correoElectronico}</p>
            </div>
          </ModalBody>
          <ModalFooter className={styles["footer"]}>
            <Button
              color="primary"
              className={styles["button"]}
              onClick={verifyErrors}
            >
              {t("Guardar")}
            </Button>

            <Button
              color="danger"
              className={styles["button"]}
              onClick={closeHandler}
            >
              {t("Cancelar")}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalUserInfo;
