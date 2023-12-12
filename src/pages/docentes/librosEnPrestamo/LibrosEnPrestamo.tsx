import styles from "./MisLibrosEnPrestamo.module.css";
import DesktopDesign from "./designs/DesktopDesing";
import { CircularProgress, Card, CardHeader } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useGetData } from "./getData";

export default function App() {
  const { data, refetchData } = useGetData();

  const { t } = useTranslation();
  return data === null ? (
    <div className={styles["loading"]}>
      <CircularProgress aria-labelledby="loading" size="lg" color="primary" />
    </div>
  ) : data.length === 0 ? (
    <div className={styles["center"]}>
      <Card className={styles["card"]}>
        <CardHeader className={styles["card-header"]}>
          {t("No hay libros disponibles")}
        </CardHeader>
      </Card>
    </div>
  ) : (
    <div className={styles["body"]}>
      <DesktopDesign prestamo={data} updateBooks={refetchData} />
    </div>
  );
}
