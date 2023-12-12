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
  prestamo: any;
  updateBooks: () => void;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({
  onClose,
  prestamo,
  updateBooks,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  const closeHandler = () => {
    setVisible(false);
    onClose();
  };

  const handleEliminarLibro = async () => {
    try {
      await db.terminarPrestamo(prestamo.idPrestamo);
      console.log(db);
      toast.success("Terminacion de prestamo exitosa");
      updateBooks();
      closeHandler();
    } catch (error) {
      console.log(error);
      toast.error("Error al terminar el prestamo");
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
            {t("Terminar Prestamo")}
          </ModalHeader>

          <ModalBody className={styles["body"]}>
            <h3>{t("¿Desea terminar el prestamo?")}</h3>

            <>
              <div className={styles["flex-double"]}>
                <div className={styles["card-data"]}>
                  <p className="text-small text-default-500">
                    {t("Nombre del Libro")}
                  </p>
                  <p className="text-md ">{prestamo.nombreLibro}</p>
                </div>

                <div className={styles["card-data"]}>
                  <p className="text-small text-default-500">{t("Autor")}</p>
                  <p className="text-md ">{prestamo.autor}</p>
                </div>
              </div>

              <div className={styles["flex-double"]}>
                <div className={styles["card-data"]}>
                  <p className="text-small text-default-500">
                    {t("Nombre del Alumno")}
                  </p>
                  <p className="text-md ">
                    {prestamo.nombres + " " + prestamo.apellidos}
                  </p>
                </div>

                <div className={styles["card-data"]}>
                  <p className="text-small text-default-500">{t("Grado")}</p>
                  <p className="text-md ">{prestamo.grado}</p>
                </div>
              </div>
            </>
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
