import { useContext, useState } from "react";
import { Card, CardHeader, CardBody, Button, Spacer } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import styles from "./Perfil.module.css";
import ProfileImageUpload from "../../../utils/ProfileImagenUpload";
import { ImageContext } from "../../../context/ImageContext";
import ModalEditProfile from "./modals/ModalEditProfile";
import { useGetDocenteData } from "./getData";
import { toast } from "react-toastify";

const ContentProfile = () => {
  var { profileImage } = useContext(ImageContext);
  const [modalEditProfile, setModalEditProfile] = useState<any>(false);
  const { docente, refetchData } = useGetDocenteData();
  const { t } = useTranslation();

  //Cierra el modal de Informacion de usuario
  const closeModalUserInfo = (data: any) => {
    if (data === "success") {
      refetchData();
      toast.success(t("Datos actualizados"));
    }

    setModalEditProfile(false);
  };

  //abre  el modal de Informacion de usuario
  const openModalUserInfo = () => {
    setModalEditProfile(true);
  };

  if (!docente) {
    console.log("No hay docente");
    return null;
  }

  return (
    <div>
      <Card className={styles["card"]}>
        <CardHeader className={styles["card-header"]}>
          <p className={styles["title"]}>{t("Perfil")}</p>
          <div className={styles["avatar"]}>
            <ProfileImageUpload
              idUsuario={docente.id}
              imagenPerfil={profileImage as string}
            />
          </div>
        </CardHeader>
        <CardBody className={styles["card-body"]}>
          <div className={styles["card-data"]}>
            <div className={styles["flex-title"]}>
              <p className="text-small text-default-500">{t("Nombres")}</p>
              <Spacer x={12} />
              <p className="text-small text-default-500">{t("Apellidos")}</p>
            </div>

            <div className={styles["flex-double"]}>
              <p className="text-md ">{docente.nombres}</p>
              <Spacer x={0} />

              <p className="text-md ">{docente.apellidos}</p>
            </div>
          </div>

          <div className={styles["card-data"]}></div>

          <div className={styles["card-data"]}>
            <p className="text-small text-default-500">
              {t("Correo Electronico")}
            </p>
            <p className="text-md ">{docente.correoElectronico}</p>
          </div>

          <Button color="primary" onClick={openModalUserInfo}>
            {t("Editar")}
          </Button>
        </CardBody>
      </Card>
      {modalEditProfile && (
        <ModalEditProfile onClose={closeModalUserInfo} usuario={docente} />
      )}
    </div>
  );
};

export default ContentProfile;
