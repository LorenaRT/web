import { useEffect, useContext, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";
import BookImage from "./BookImage";
import { SearchContext } from "../../../context/SearchContext";
import styles from "./SolicitarPrestamo.module.css";
import { useGetData } from "./getData";
import db from "../../../services/db";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const { data, refetchData } = useGetData();
  const { searchTerm } = useContext(SearchContext);
  const [filteredData, setFilteredData] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    let filteredBooks = data;

    if (searchTerm) {
      filteredBooks = data.filter(
        (book: any) =>
          (book.autor &&
            book.autor.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (book.titulo &&
            book.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else {
      filteredBooks = data;
    }

    setFilteredData(filteredBooks);
  }, [data, searchTerm]);

  const handleSolicitarLibro = async (idLibro: number) => {
    //obtener el id del alumno
    const token = Cookies.get("accessToken");
    const decoded: any = jwtDecode(token as string);
    const idAlumno = decoded.id;

    try {
      const res = await db.solicitarLibro(idAlumno, idLibro);
      if (res.status === 200) {
        toast.success("Libro solicitado con éxito");
      }
      refetchData();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("No se pudo solicitar el libro");
      } else {
        console.log(error);
      }
    }
  };

  const quantityColor = (quantity: any) => {
    if (quantity > 2) {
      return "green";
    } else if (quantity > 0) {
      return "orange";
    } else {
      return "red";
    }
  };

  //obtener todas las solicitudes de prestamo del alumno

  const getMisSolicitudesPrestamo = async () => {
    //obtener el id del alumno
    const token = Cookies.get("accessToken");
    const decoded: any = jwtDecode(token as string);
    const idAlumno = decoded.id;

    try {
      const res = await db.getMisSolicitudesPrestamo(idAlumno);
      setSolicitudes(res.data.solicitudes);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("No se pudo solicitar el libro");
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getMisSolicitudesPrestamo();
  }, [refetchData]);

  return (
    <div className={styles["main"]}>
      <ScrollShadow
        size={10}
        className={styles["card-container"]}
        style={{ overflowY: "auto", maxHeight: "92vh" }}
      >
        {filteredData.map((book: any) => (
          <Card key={book.idLibro} className={styles["card"]}>
            <div className="text-2xl font-bold text-secundary">
              {book.titulo.charAt(0).toUpperCase() + book.titulo.slice(1)}
            </div>

            <div className={styles["layout-card"]}>
              <div className={styles["center"]}>
                <div className={styles["image"]}>
                  <BookImage idLibro={book.idLibro} />
                </div>
              </div>

              <div className={styles["info"]}>
                <CardBody>
                  <p className="text-small text-default-500">Autor</p>
                  <p>
                    {book.autor.charAt(0).toUpperCase() + book.autor.slice(1)}
                  </p>
                  <p className="text-small text-default-500">Género</p>
                  <p>
                    {book.genero.charAt(0).toUpperCase() + book.genero.slice(1)}
                  </p>
                  <p className="text-small text-default-500">Editorial</p>
                  <p>
                    {book.editorial.charAt(0).toUpperCase() +
                      book.editorial.slice(1)}
                  </p>
                  <p className="text-small text-default-500">
                    Cantidad Disponible
                  </p>
                  <p style={{ color: quantityColor(book.cantidad) }}>
                    {book.cantidad}
                  </p>
                </CardBody>
              </div>
            </div>
            <div className={styles["button"]}>
              <Button
                isDisabled={
                  book.cantidad === 0 ||
                  solicitudes.some(
                    (solicitud: any) => solicitud.idLibro === book.idLibro
                  )
                }
                color="primary"
                onClick={() => handleSolicitarLibro(book.idLibro)}
              >
                {book.cantidad === 0
                  ? "Agotado"
                  : solicitudes.some(
                      (solicitud: any) => solicitud.idLibro === book.idLibro
                    )
                  ? "Solicitud enviada"
                  : "Solicitar"}
              </Button>
            </div>
          </Card>
        ))}
      </ScrollShadow>
    </div>
  );
};

export default Home;
