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
  libro: any;
  updateBooks: () => void;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({
  onClose,
  libro,
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
      await db.EliminarLibro(libro.idLibro);
      toast.success("Libro eliminado con exito");
      updateBooks();
      closeHandler();
    } catch (error) {
      toast.error("Error al eliminar el libro");
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
            {t("Eliminar libro")}
          </ModalHeader>

          <ModalBody className={styles["body"]}>
            <h3>{t("¿Desea eliminar los libros?")}</h3>
            <div className={styles["card-data"]}>
              <p className="text-small text-default-500">
                {t("Nombre del Libro")}
              </p>
              <p className="text-md ">{libro.titulo}</p>

              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Autor")}</p>
                <p className="text-md ">{libro.autor}</p>
              </div>
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
