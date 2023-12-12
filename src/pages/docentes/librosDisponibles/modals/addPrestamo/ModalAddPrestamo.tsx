import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Autocomplete,
  AutocompleteItem,
  Image,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import styles from "./ModalAddPrestamo.module.css";
import db from "../../../../../services/db";
import { toast } from "react-toastify";
import defaultImage from "../../../../../assets/defaultBook.png";

interface InfoUserProps {
  onClose: () => void;
  libro: any;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({ onClose, libro }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState<any>();
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<any>();
  const [imagen, setImagen] = useState<any>(null);

  const closeHandler = () => {
    setVisible(false);
    onClose();
  };

  //Registrar el prestamo en la base de datos
  const handleRegistrarPrestamo = async () => {
    let data;
    data = {
      idLibro: libro.idLibro,
      idAlumno: selectedAlumno.idAlumno,
    };
    try {
      const response = await db.registrarPrestamo(data);

      if (response.status === 200) {
        toast.success(t("El prestamo se registro correctamente"));
        //actualizar la cantidad de libros disponibles en la tabla libros
        closeHandler();
      }
    } catch (error: any) {
      if (error.response.status === 400 || error.response.status === 404) {
        toast.error(t("Error al registrar el prestamo"));
        console.log(error.response.data.message);
      }
    }
  };

  const handleVerificarDatos = () => {
    if (!selectedAlumnoId) {
      toast.error(t("Nesecita seleccionar un alumno"));
      return;
    }

    //verificar que hay libros disponibles al menos 1
    if (libro.cantidad === 0) {
      toast.error(t("No hay libros disponibles"));
      return;
    }

    handleRegistrarPrestamo();
  };

  //useEffect para obtener todos los alumnos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await db.getAllAlumnos();
        setAlumnos(res.data);
      } catch (error) {
        toast.error(t("Error al obtener los alumnos"));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedAlumnoId) return;
    const alumno = alumnos.find(
      (alumno) => alumno.idAlumno === Number(selectedAlumnoId)
    );
    setSelectedAlumno(alumno);

    console.log(alumno);
  }, [selectedAlumnoId]);

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

  return (
    <Modal
      size="xl"
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
            {t("Registrar Prestamo de Libro")}
          </ModalHeader>
          <ModalBody className={styles["body"]}>
            <Image src={imagen || defaultImage} width={120} height={120} />

            <div className={styles["nombres"]}>
              <p className="text-small text-default-500">
                {t("Nombre del Libro")}
              </p>
              <p className="text-md ">{libro.titulo}</p>

              <p className="text-small text-default-500">
                {t("Cantidad disponible")}
              </p>
              <p className="text-md ">{libro.cantidad}</p>
            </div>

            <Autocomplete
              defaultItems={alumnos}
              label="Alumno"
              placeholder="Buscar alumno"
              className="max-w-xs"
              isClearable={false}
              onSelectionChange={(item) => setSelectedAlumnoId(item)}
            >
              {(alumnos) => (
                <AutocompleteItem key={alumnos.idAlumno}>
                  {alumnos.nombres + " " + alumnos.apellidos}
                </AutocompleteItem>
              )}
            </Autocomplete>

            {selectedAlumno && (
              <>
                <div className={styles["nombres"]}>
                  <p className="text-small text-default-500">
                    {t("Nombre del Alumno")}
                  </p>
                  <p className="text-md ">
                    {selectedAlumno.nombres + " " + selectedAlumno.apellidos}
                  </p>
                </div>

                <div className={styles["nombres"]}>
                  <p className="text-small text-default-500">
                    {t("Usuario del Alumno")}
                  </p>
                  <p className="text-md ">{selectedAlumno.usuario}</p>
                </div>

                <div className={styles["nombres"]}>
                  <p className="text-small text-default-500">
                    {t("Grado del Alumno")}
                  </p>
                  <p className="text-md ">{selectedAlumno.grado}</p>
                </div>
              </>
            )}
          </ModalBody>

          <ModalFooter className={styles["footer"]}>
            <Button
              onClick={handleVerificarDatos}
              color="primary"
              className={styles["button"]}
            >
              {t("Registrar")}
            </Button>

            <Button
              color="danger"
              className={styles["button"]}
              onClick={closeHandler}
            >
              {t("Cancelar")}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalUserInfo;
