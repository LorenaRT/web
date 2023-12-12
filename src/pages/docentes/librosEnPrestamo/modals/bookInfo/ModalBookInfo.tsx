import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Image,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import styles from "./ModalBookInfo.module.css";
import db from "../../../../../services/db";
import defaultImage from "../../../../../assets/defaultBook.png";

interface InfoUserProps {
  onClose: () => void;
  prestamo: any;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({ onClose, prestamo }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [imagen, setImagen] = useState<any>(null);

  const closeHandler = () => {
    setVisible(false);
    onClose();
  };

  //obtener imagen

  const obtenerImagen = async () => {
    try {
      const res = await db.getBookImage(prestamo.idLibro);
      setImagen(URL.createObjectURL(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerImagen();
  }, []);

  console.log(prestamo);

  function formatearFecha(fecha: any) {
    const fechaObj = new Date(fecha);

    // Obtener componentes de la fecha
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1; // Nota: en JavaScript, los meses comienzan desde 0
    const year = fechaObj.getFullYear();
    let hora = fechaObj.getHours();
    const minutos = fechaObj.getMinutes();

    // Determinar si es AM o PM
    const periodo = hora >= 12 ? "PM" : "AM";

    // Convertir a formato de 12 horas
    hora = hora % 12 || 12;

    // Agregar ceros iniciales si es necesario
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    const horaFormateada = hora < 10 ? `0${hora}` : hora;
    const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;

    // Crear la cadena formateada
    const fechaFormateada = `${diaFormateado}/${mesFormateado}/${year}, ${horaFormateada}:${minutosFormateados} ${periodo}`;

    return fechaFormateada;
  }

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
            {t("Informacion del prestamo")}
            <Image src={imagen || defaultImage} width={150} height={150} />
          </ModalHeader>
          <ModalBody className={styles["body"]}>
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

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Fecha de prestamo")}
                </p>
                <p className="text-md ">
                  {formatearFecha(prestamo.fechaPrestamo)}
                </p>
              </div>
              <div className={styles["card-data"]}></div>
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
