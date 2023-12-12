import React, { useState } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Input,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import styles from "./ModalAlumnoEdit.module.css";
import db from "../../../../../services/db";
import { toast } from "react-toastify";

interface InfoUserProps {
  onClose: () => void;
  alumnos: any;
  updateAlumnos: () => void;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({
  onClose,
  alumnos,
  updateAlumnos,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  const closeHandler = () => {
    setVisible(false);
    onClose();
  };

  // Estados para cada propiedad del alumnos
  const [nombres, setNombres] = useState(alumnos.nombres);
  const [apellidos, setApellidos] = useState(alumnos.apellidos);
  const [grado, setGrado] = useState(alumnos.grado);
  const [password, setPassword] = useState(alumnos.password);

  const [nombreAlumnoError, setNombreAlumnoError] = useState("");
  const [apellidoAlumnoError, setAutorError] = useState("");
  const [gradoError, setGradoError] = useState("");

  const handleErrors = () => {
    // Validar que los campos no esten vacios
    const errors = {
      nombreAlumnoError: "",
      apellidoAlumnoError: "",
      gradoError: "",
    };

    //limpiar los errores
    setNombreAlumnoError("");
    setAutorError("");
    setGradoError("");

    // Validar que el nombre del alumnos no este vacio
    if (nombres.trim() === "") {
      errors.nombreAlumnoError = "El nombre del alumnos es requerido";
    }

    // Validar que el apellidos no este vacio
    if (apellidos.trim() === "") {
      errors.apellidoAlumnoError = "El apellidos es requerido";
    }

    // Validar que la grado no este vacia
    if (grado.trim() === "") {
      errors.gradoError = "La grado es requerida";
    }

    // Validar grado
    if (grado.trim() !== "") {
      const re = /^[4-6]$/;
      if (!re.test(grado)) {
        errors.gradoError = "La grado debe ser de 4to a 6to grado";
      }
    }

    // Si hay errores
    if (
      errors.nombreAlumnoError ||
      errors.apellidoAlumnoError ||
      errors.gradoError
    ) {
      setNombreAlumnoError(errors.nombreAlumnoError);
      setAutorError(errors.apellidoAlumnoError);
      setGradoError(errors.gradoError);
      return;
    }

    // Si no hay errores
    handleEditarLibro();
  };

  // Manejador para editar el alumnos
  const handleEditarLibro = async () => {
    //si la contraseña esta vacia, no se actualiza
    let alumnoEditado;
    if (password === "") {
      alumnoEditado = {
        idAlumno: alumnos.idAlumno,
        nombres: nombres,
        apellidos: apellidos,
        grado: grado,
      };
    } else {
      alumnoEditado = {
        idAlumno: alumnos.idAlumno,
        nombres: nombres,
        apellidos: apellidos,
        grado: grado,
        password: password,
      };
    }

    try {
      const res = await db.editAlumno(alumnoEditado);
      if (
        res.status === 200 &&
        res.data.message === "Alumno actualizado correctamente."
      ) {
        toast.success("Alumno actualizado correctamente.");
        updateAlumnos();
        closeHandler();
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            {t("Editar Alumno")}
          </ModalHeader>
          <ModalBody className={styles["body"]}>
            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Nombres")}</p>
                <Input
                  errorMessage={nombreAlumnoError}
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="text-md"
                ></Input>
              </div>

              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">{t("Apellidos")}</p>
                <Input
                  errorMessage={apellidoAlumnoError}
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="text-md"
                ></Input>
              </div>
            </div>

            <div className={styles["flex-double"]}>
              <div className={styles["card-data"]}>
                <p className="text-small text-default-500">
                  {t("Grado del Alumno")}
                </p>
                <Input
                  errorMessage={gradoError}
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                  className="text-md"
                ></Input>
              </div>

              <div className={styles["flex-double"]}>
                <div className={styles["card-data"]}>
                  <p className="text-small text-default-500">
                    {t("Contraseña")}
                  </p>
                  <p className="text-md ">
                    <Input
                      type="string"
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-md"
                    ></Input>
                  </p>
                </div>
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
