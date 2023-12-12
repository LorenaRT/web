import React, { useState } from "react";
import {
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import styles from "./ModalUser.module.css";

interface InfoUserProps {
  onClose: () => void;
  usuario: any;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({ onClose, usuario }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  const closeHandler = () => {
    setVisible(false);
    onClose();
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
          <ModalBody className={styles["body"]}>
            {t("Registro de Usuario Exitoso")}

            <div className={styles["card-data"]}>
              <p className="text-small text-default-500">
                {t("Usuario para Iniciar Sesión")}
              </p>
              <p className="text-md ">{usuario.usuario}</p>
            </div>
          </ModalBody>
          <ModalFooter className={styles["footer"]}>
            <Button
              color="primary"
              onClick={closeHandler}
              className={styles["button"]}
            >
              {t("Aceptar")}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalUserInfo;
