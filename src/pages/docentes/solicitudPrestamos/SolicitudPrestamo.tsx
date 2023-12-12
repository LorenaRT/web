import { useEffect, useContext, useState } from "react";
import { Card, CardBody, Button, Spacer } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";
import BookImage from "./BookImage";
import { SearchContext } from "../../../context/SearchContext";
import styles from "./SolicitudPrestamo.module.css";
import { useGetData } from "./getData";
import db from "../../../services/db";
import { toast } from "react-toastify";

const Home = () => {
  const { data, refetchData } = useGetData();
  const { searchTerm } = useContext(SearchContext);
  const [filteredData, setFilteredData] = useState([]);

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

  const handleProcesarSolicitud = async (
    idSolicitud: number,
    respuesta: string
  ) => {
    try {
      const res = await db.procesarSolicitud(idSolicitud, respuesta);
      if (res.status === 200) {
        toast.success("Solicitud aceptada con éxito");
      }
      refetchData();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("No se pudo aceptar la solicitud");
      } else {
        console.log(error);
      }
    }
  };

  console.log(filteredData);
  return (
    <div className={styles["main"]}>
      <ScrollShadow
        size={10}
        className={styles["card-container"]}
        style={{ overflowY: "auto", maxHeight: "92vh" }}
      >
        {filteredData.map((book: any) => (
          <Card key={book.idSolicitudPrestamo} className={styles["card"]}>
            <div className="text-2xl font-bold text-secundary">
              {book.nombreLibro.charAt(0).toUpperCase() +
                book.nombreLibro.slice(1)}
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
                  <p className="text-small text-default-500">Editorial</p>
                  <p>
                    {book.editorial.charAt(0).toUpperCase() +
                      book.editorial.slice(1)}
                  </p>
                  <p className="text-small text-default-500">
                    Nombre del Alumno
                  </p>
                  <p>{book.nombres + " " + book.apellidos}</p>

                  <p className="text-small text-default-500">Usuario</p>
                  <p>{book.usuario}</p>
                </CardBody>
              </div>
            </div>
            <div className={styles["double-button"]}>
              <Button
                isDisabled={book.cantidad === 0}
                color="primary"
                onClick={() => {
                  handleProcesarSolicitud(book.idSolicitud, "Aceptada");
                }}
              >
                Aceptar
              </Button>

              <Spacer x={10} />

              <Button
                isDisabled={book.cantidad === 0}
                color="danger"
                onClick={() => {
                  handleProcesarSolicitud(book.idSolicitud, "Rechazada");
                }}
              >
                Rechazar
              </Button>
            </div>
          </Card>
        ))}
      </ScrollShadow>
    </div>
  );
};

export default Home;
