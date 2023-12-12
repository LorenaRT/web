import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Input,
  Image,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import styles from "./ModalBookEdit.module.css";
import db from "../../../../../services/db";
import defaultImage from "../../../../../assets/defaultBook.png";
import { toast } from "react-toastify";

interface InfoUserProps {
  onClose: () => void;
  libro: any;
  updateBooks: () => void;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({
  onClose,
  libro,
  updateBooks,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [imagen, setImagen] = useState<any>(null);

  const closeHandler = () => {
    setVisible(false);
    onClose();
  };

  // Estados para cada propiedad del libro
  const [titulo, setTitulo] = useState(libro.titulo);
  const [autor, setAutor] = useState(libro.autor);
  const [editorial, setEditorial] = useState(libro.editorial);
  const [genero, setGenero] = useState(libro.genero);
  const [cantidad, setCantidad] = useState(libro.cantidad);
  const [fechaPublicacion, setFechaPublicacion] = useState(
    libro.fechaPublicacion
  );
  const [paginas, setPaginas] = useState(libro.paginas);
  const [descripcion, setDescripcion] = useState(libro.descripcion);

  const [nombreLibroError, setNombreLibroError] = useState("");
  const [autorError, setAutorError] = useState("");
  const [editorialError, setEditorialError] = useState("");
  const [generoError, setGeneroError] = useState("");
  const [cantidadError, setCantidadError] = useState("");

  // Obtener imagen
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

  const handleErrors = () => {
    // Validar que los campos no esten vacios
    const errors = {
      nombreLibroError: "",
      autorError: "",
      editorialError: "",
      generoError: "",
      cantidadError: "",
    };

    //limpiar los errores
    setNombreLibroError("");
    setAutorError("");
    setEditorialError("");
    setGeneroError("");
    setCantidadError("");

    // Validar que el nombre del libro no este vacio
    if (titulo.trim() === "") {
      errors.nombreLibroError = "El nombre del libro es requerido";
    }

    // Validar que el autor no este vacio
    if (autor.trim() === "") {
      errors.autorError = "El autor es requerido";
    }

    // Validar que la editorial no este vacia
    if (editorial.trim() === "") {
      errors.editorialError = "La editorial es requerida";
    }

    // Validar que el genero no este vacio
    if (genero.trim() === "") {
      errors.generoError = "El genero es requerido";
    }

    if (Number(cantidad) <= -1) {
      errors.cantidadError = "Ingresa una cantidad valida";
    }

    // Si hay errores
    if (
      errors.nombreLibroError ||
      errors.autorError ||
      errors.editorialError ||
      errors.generoError ||
      errors.cantidadError
    ) {
      setNombreLibroError(errors.nombreLibroError);
      setAutorError(errors.autorError);
      setEditorialError(errors.editorialError);
      setGeneroError(errors.generoError);
      setCantidadError(errors.cantidadError);
      return;
    }

    // Si no hay errores
    handleEditarLibro();
  };

  // Manejador para editar el libro
  const handleEditarLibro = async () => {
    const libroEditado = {
      idLibro: libro.idLibro,
      titulo,
      autor,
      editorial,
      genero,
      cantidad,
      fechaPublicacion,
      paginas,
      descripcion,
    };

    try {
      const res = await db.editBook(libroEditado);
      if (
        res.status === 200 &&
        res.data.message === "Libro actualizado exitosamente"
      ) {
        toast.success("Libro editado correctamente");
        updateBooks();
        closeHandler();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fecha = new Date(libro.fechaPublicacion);
    setFechaPublicacion(fecha.toISOString().split("T")[0]);
  }, []);

  return (
    <Modal
      size="2xl"
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
            {t("Editar Libro")}
            <Image src={imagen || defaultImage} width={150} height={150} />
          </ModalHeader>
          <ModalBody className={styles["body"]}>
            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Nombre del Libro")}
                </p>
                <Input
                  errorMessage={nombreLibroError}
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="text-md"
                ></Input>
              </div>

              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Autor")}</p>
                <Input
                  errorMessage={autorError}
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  className="text-md"
                ></Input>
              </div>
            </div>

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Editorial")}</p>
                <Input
                  errorMessage={editorialError}
                  value={editorial}
                  onChange={(e) => setEditorial(e.target.value)}
                  className="text-md"
                ></Input>
              </div>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Genero")}</p>
                <Input
                  errorMessage={generoError}
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="text-md"
                ></Input>
              </div>
            </div>

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Cantidad Disponible")}
                </p>
                <Input
                  errorMessage={cantidadError}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="text-md"
                ></Input>
              </div>

              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Fecha de Publicacion")}
                </p>

                <Input
                  type="date"
                  value={fechaPublicacion}
                  onChange={(e) => setFechaPublicacion(e.target.value)}
                  className="text-md"
                ></Input>
              </div>
            </div>

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Paginas")}</p>
                <p className="text-md ">
                  <Input
                    type="number"
                    value={paginas}
                    onChange={(e) => setPaginas(e.target.value)}
                    className="text-md"
                  ></Input>
                </p>
              </div>

              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Descripcion")}
                </p>
                <p className="text-md ">
                  <Input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="text-md"
                  ></Input>
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className={styles["footer"]}>
            <Button
              color="primary"
              className={styles["button"]}
              onClick={handleErrors}
            >
              {t("Guardar")}
            </Button>

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
