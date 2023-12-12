import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CircularProgress,
  CardHeader,
} from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";
import BookImage from "./BookImage";
import styles from "./Home.module.css";
import { useGetData } from "./getData";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

const Home = () => {
  const [filteredData, setFilteredData] = useState([]);
  const { t } = useTranslation();
  const token = Cookies.get("accessToken");
  const decoded: any = jwtDecode(token as string);

  const idAlumno = decoded.id;
  const { data } = useGetData(idAlumno);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

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
    const ampm = hora >= 12 ? "P.M." : "A.M.";
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
  return data === null ? (
    <div className={styles["loading"]}>
      <CircularProgress aria-labelledby="loading" size="lg" color="primary" />
    </div>
  ) : data.length === 0 ? (
    <div className={styles["center"]}>
      <Card className={styles["card-center"]}>
        <CardHeader className={styles["card-header"]}>
          {t("No hay libros disponibles")}
        </CardHeader>
      </Card>
    </div>
  ) : (
    <div className={styles["main"]}>
      <ScrollShadow
        size={10}
        className={styles["card-container"]}
        style={{ overflowY: "auto", maxHeight: "92vh" }}
      >
        {filteredData.map((prestamo: any) => (
          <Card key={prestamo.idPrestamo} className={styles["card"]}>
            <div className="text-2xl font-bold text-secundary">
              {prestamo.nombreLibro.charAt(0).toUpperCase() +
                prestamo.nombreLibro.slice(1)}
            </div>

            <div className={styles["layout-card"]}>
              <div className={styles["center"]}>
                <div className={styles["image"]}>
                  <BookImage idLibro={prestamo.idLibro} />
                </div>
              </div>

              <div className={styles["info"]}>
                <CardBody>
                  <p className="text-small text-default-500">Autor</p>
                  <p>
                    {prestamo.autor.charAt(0).toUpperCase() +
                      prestamo.autor.slice(1)}
                  </p>
                  <p className="text-small text-default-500">Género</p>
                  <p>
                    {prestamo.genero.charAt(0).toUpperCase() +
                      prestamo.genero.slice(1)}
                  </p>
                  <p className="text-small text-default-500">Editorial</p>
                  <p>
                    {prestamo.editorial.charAt(0).toUpperCase() +
                      prestamo.editorial.slice(1)}
                  </p>
                  <p className="text-small text-default-500">
                    Fecha de Prestamo
                  </p>
                  <p>{formatDate(prestamo.fechaPrestamo)}</p>
                </CardBody>
              </div>
            </div>
          </Card>
        ))}
      </ScrollShadow>
    </div>
  );
};

export default Home;
