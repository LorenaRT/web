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
import { formatDate } from "../../../../../utils/FormatDate";
import db from "../../../../../services/db";
import defaultImage from "../../../../../assets/defaultBook.png";

interface InfoUserProps {
  onClose: () => void;
  libro: any;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({ onClose, libro }) => {
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
      const res = await db.getBookImage(libro.idLibro);
      setImagen(URL.createObjectURL(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerImagen();
  }, []);

  //setear imagen a url

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
            {t("Informacion del libro")}
            <Image src={imagen || defaultImage} width={150} height={150} />
          </ModalHeader>
          <ModalBody className={styles["body"]}>
            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Nombre del Libro")}
                </p>
                <p className="text-md ">{libro.titulo}</p>
              </div>

              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Autor")}</p>
                <p className="text-md ">{libro.autor}</p>
              </div>
            </div>

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Editorial")}</p>
                <p className="text-md ">{libro.editorial}</p>
              </div>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Genero")}</p>
                <p className="text-md ">{libro.genero}</p>
              </div>
            </div>

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Cantidad Disponible")}
                </p>
                <p className="text-md ">{libro.cantidad}</p>
              </div>

              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Fecha de Publicacion")}
                </p>
                <p className="text-md ">
                  {libro.fechaPublicacion
                    ? formatDate(libro.fechaPublicacion)
                    : "No Disponible"}
                </p>
              </div>
            </div>

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Paginas")}</p>
                <p className="text-md ">
                  {libro.paginas ? libro.paginas : "No Disponible"}
                </p>
              </div>
            </div>

            <div className={styles["card-data"]}>
              <p className="text-small text-default-500">{t("Descripcion")}</p>
              <p className="text-md ">
                {libro.descripcion ? libro.descripcion : "No Disponible"}
              </p>
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
