import { useContext } from "react";
import { Card, CardHeader, CardBody, Spacer, Image } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import styles from "./Perfil.module.css";
import { ImageContext } from "../../../context/ImageContext";
import { useGetDataAlumno } from "./getData";
import defaultProfileImage from "../../../assets/profile.png";

const ContentProfile = () => {
  var { profileImage } = useContext(ImageContext);
  const { alumno } = useGetDataAlumno();
  const { t } = useTranslation();

  if (!alumno) {
    console.log("No hay alumno");
    return null;
  }

  return (
    <div>
      <Card className={styles["card"]}>
        <CardHeader className={styles["card-header"]}>
          <p className={styles["title"]}>{t("Perfil")}</p>
          <div className={styles["avatar"]}>
            <Image
              src={profileImage ? profileImage : defaultProfileImage}
              width={150}
              height={150}
              className={styles["image"]}
              alt="profile image"
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
              <p className="text-md ">{alumno.nombres}</p>
              <Spacer x={0} />

              <p className="text-md ">{alumno.apellidos}</p>
            </div>
          </div>

          <div className={styles["card-data"]}></div>

          <div className={styles["card-data"]}>
            <p className="text-small text-default-500">
              {t("Usuario de acceso")}
            </p>
            <p className="text-md ">{alumno.usuario}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ContentProfile;
