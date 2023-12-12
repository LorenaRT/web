import React, { useState } from "react";
import {
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalHeader,
  Spacer,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import db from "../../../../../services/db";
import { toast } from "react-toastify";
import styles from "./ModalConfirm.module.css";

interface InfoUserProps {
  onClose: () => void;
  updateAlumnos: () => void;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({ onClose, updateAlumnos }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  const closeHandler = () => {
    setVisible(false);
    onClose();
  };

  const handleAumentarGrados = async () => {
    try {
      const response = await db.aumentarGradoAlumnos();

      if (response.status === 200) {
        toast.success("Grado aumentado correctamente");
        updateAlumnos();
        closeHandler();
      }
    } catch (error: any) {
      if (error.response) {
        toast.error("Ocurrió un error al aumentar el grado");
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
            {t("Aumentar Grado")}
          </ModalHeader>

          <ModalBody className={styles["body"]}>
            <h4>{t("¿Está seguro de aumentar el grado de los alumnos?")}</h4>
            <div className={styles["card-data"]}>
              <p className="text-small text-default-900 ">
                Se aumentará un grado a todos los alumnos y se eliminarán
                aquellos que pasen de 6to grado si no tienen libros en préstamo
              </p>

              <Spacer y={3} />

              <p className="text-small text-default-900">
                Los alumnos que no se puedan eliminar por tener libros en
                préstamo se mostraran como 7mo grado de color rojo
              </p>

              <Spacer y={3} />

              <p className="text-md">¿Desea continuar?</p>
            </div>
          </ModalBody>
          <ModalFooter className={styles["footer"]}>
            <Button
              color="primary"
              className={styles["button"]}
              onClick={handleAumentarGrados}
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
