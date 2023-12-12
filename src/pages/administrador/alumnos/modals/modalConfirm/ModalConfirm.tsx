import React, { useState } from "react";
import {
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import db from "../../../../../services/db";
import { toast } from "react-toastify";
import styles from "./ModalConfirm.module.css";

interface InfoUserProps {
  onClose: () => void;
  alumnos: any;
  updateAlumnos: () => void;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({
  onClose,
  alumnos,
  updateAlumnos,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  const closeHandler = () => {
    setVisible(false);
    onClose();
  };

  const handleEliminarLibro = async () => {
    try {
      await db.deleteAlumno(alumnos.idAlumno);
      toast.success("Alumno eliminado");
      updateAlumnos();
      closeHandler();
    } catch (error: any) {
      if (
        (error.response.message =
          "No se puede eliminar el alumno porque tiene préstamos asociados.")
      ) {
        toast.error(
          "No se puede eliminar el alumno porque tiene préstamos asociados."
        );
      } else {
        toast.error("Error al eliminar el alumno");
      }
    }
  };

  return (
    <Modal
      size="lg"
      isOpen={visible}
      aria-labelledby="modal-signup"
      onClose={closeHandler}
      backdrop="blur"
      isDismissable={false}
      scrollBehavior="inside"
      placement="auto"
    >
      <ModalContent>
        <>
          <ModalHeader className={styles["header"]}>
            {t("Eliminar Alumno")}
          </ModalHeader>

          <ModalBody className={styles["body"]}>
            <h3>{t("¿Desea eliminar el siguiente alumno?")}</h3>
            <div className={styles["card-data"]}>
              <p className="text-small text-default-500">
                {t("Nombre del alumno")}
              </p>
              <p className="text-md ">
                {alumnos.nombres + " " + alumnos.apellidos}
              </p>
            </div>
          </ModalBody>
          <ModalFooter className={styles["footer"]}>
            <Button
              color="primary"
              className={styles["button"]}
              onClick={handleEliminarLibro}
            >
              {t("Aceptar")}
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
