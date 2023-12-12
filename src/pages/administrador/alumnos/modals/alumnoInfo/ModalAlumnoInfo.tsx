import React, { useState } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import styles from "./ModalAlumnoInfo.module.css";

interface InfoUserProps {
  onClose: () => void;
  alumnos: any;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({ onClose, alumnos }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  const closeHandler = () => {
    setVisible(false);
    onClose();
  };

  const formatDate = (date: string) => {
    if (!date) {
      return ""; // o cualquier otro manejo apropiado para valores nulos o indefinidos
    }

    const fecha = new Date(date);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleString("en-EN", { month: "long" });
    const year = fecha.getFullYear();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const ampm = hora >= 12 ? "p.m." : "a.m.";
    let hora12 = hora % 12;
    if (hora12 === 0) {
      hora12 = 12;
    }
    const minutosFormateados = minutos < 10 ? "0" + minutos : minutos;
    const horaFormateada = hora12 + ":" + minutosFormateados + " " + ampm;

    return (
      <span>
        {`${dia} ${t("completeMonth." + mes)} ${year} ${horaFormateada}`}{" "}
      </span>
    );
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
            {t("Informacion del Alumno")}
          </ModalHeader>
          <ModalBody className={styles["body"]}>
            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Nombre del Alumno")}
                </p>
                <p className="text-md ">
                  {alumnos.nombres + " " + alumnos.apellidos}
                </p>
              </div>
            </div>

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Usuario")}</p>
                <p className="text-md ">{alumnos.usuario}</p>
              </div>
            </div>

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Grado Academico")}
                </p>
                <p className="text-md ">{alumnos.grado}</p>
              </div>
            </div>

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Fecha de Creacion")}
                </p>
                <p className="text-md ">{formatDate(alumnos.createdAt)}</p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className={styles["footer"]}>
            <Button
              color="danger"
              className={styles["button"]}
              onClick={closeHandler}
            >
              {t("Cerrar")}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalUserInfo;
