import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Image,
  Spacer,
} from "@nextui-org/react";
import styles from "./AgregarDocente.module.css";
import { useState, useRef, useEffect } from "react";
import db from "../../../services/db";
import { toast } from "react-toastify";
import defaultImage from "../../../assets/profile.png";

const AddDocente = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [password, setPassword] = useState("");
  const [imagen, setImagen] = useState();

  const [nombreError, setNombreError] = useState("");
  const [apellidoError, setApellidoError] = useState("");
  const [correoElectronicoError, setCorreoElectronicoError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [imagePreview, setImagePreview] = useState<string | undefined>(imagen);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleErrors = () => {
    const errors = {
      nombreError: "",
      apellidoError: "",
      correoElectronicoError: "",
      passwordError: "",
    };

    setNombreError("");
    setApellidoError("");
    setCorreoElectronicoError("");
    setPasswordError("");

    if (nombre.trim() === "") {
      errors.nombreError = "El nombre del docente es requerido";
    }

    if (apellido.trim() === "") {
      errors.apellidoError = "El apellido es requerido";
    }

    if (correoElectronico.trim() === "") {
      errors.correoElectronicoError = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoElectronico)) {
      errors.correoElectronicoError = "El correo electrónico no es válido";
    }

    // Validar que el nombre no contenga números
    if (!/^[A-Za-zÁ-ÿ\s]+$/.test(nombre)) {
      errors.nombreError =
        "El nombre no debe contener números ni caracteres especiales";
    }

    // Validar que el apellido no contenga números
    if (!/^[A-Za-zÁ-ÿ\s]+$/.test(apellido)) {
      errors.apellidoError =
        "El apellido no debe contener números ni caracteres especiales";
    }

    if (password.trim().length < 6) {
      errors.passwordError = "La contraseña debe tener al menos 6 caracteres";
    }

    if (
      errors.nombreError ||
      errors.apellidoError ||
      errors.correoElectronicoError ||
      errors.passwordError
    ) {
      setNombreError(errors.nombreError);
      setApellidoError(errors.apellidoError);
      setCorreoElectronicoError(errors.correoElectronicoError);
      setPasswordError(errors.passwordError);
      return;
    }

    handleAddDocente();
  };

  const handleAddDocente = async () => {
    if (password === "") {
      setPassword(null as any);
    }

    try {
      const docente = {
        nombre,
        apellido,
        correoElectronico,
        password,
      };

      const response = await db.registraDocente(docente);

      console.log(response);

      if (response.status === 200 && response.data.idDocente && imagen) {
        const responseImagen = await db.agregarImagenDocente(
          response.data.idDocente,
          imagen
        );

        if (responseImagen.status === 200) {
          toast.success("Docente agregado correctamente");
          setNombre("");
          setApellido("");
          setCorreoElectronico("");
          setPassword("");
          setImagePreview(undefined);
        }
      } else if (response.data.message === "Docente agregado exitosamente") {
        toast.success("Docente agregado correctamente");
        setNombre("");
        setApellido("");
        setCorreoElectronico("");
        setPassword("");
        setImagePreview(undefined);
      }
    } catch (error: any) {
      if (error.response) {
        if (
          error.response.data.message ===
          "El correo electrónico ya está registrado."
        ) {
          toast.error("El correo electrónico ya está registrado");
          setCorreoElectronicoError("El correo electrónico ya está registrado");
        } else {
          toast.error("Ocurrió un error al agregar el docente");
        }
      }
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Validar el tamaño del archivo (4 MB máximo)
      if (file.size <= 4 * 1024 * 1024) {
        // Validar el tipo de archivo gif, png, jpg, jpeg
        const fileType = file.type;
        if (
          fileType === "image/png" ||
          fileType === "image/jpeg" ||
          fileType === "image/jpg"
        ) {
          const formData = new FormData();
          formData.append("image", file);
          setImagen(formData as any);
          setImagePreview(URL.createObjectURL(file));
        } else {
          // Si el tipo de archivo no es válido, mostrar un mensaje de error
          toast.error("Tipo de archivo no válido");
          console.error("Tipo de archivo no válido" + fileType);
        }
      } else {
        // Si el tamaño del archivo excede los 4 MB, mostrar un mensaje de error
        toast.error("El tamaño del archivo excede los 4 MB");
        console.error("Tamaño de archivo excedido: " + file.size);
      }
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    setImagePreview(imagePreview);
  }, [imagePreview]);

  return (
    <div className={styles["layout"]}>
      <div className={styles["center"]}>
        <Card className={styles["card"]}>
          <div className={styles["center-top"]}>
            <CardHeader className={styles["card-header"]}>
              <h1 className={styles["title"]}>Agregar Docente</h1>
            </CardHeader>
          </div>
          <CardBody className={styles["card-body"]}>
            <div className={styles["layoutData"]}>
              <div className={styles["imagen"]}>
                <div>
                  <div className={styles["center"]}>
                    <Image
                      isZoomed
                      className={styles["img"]}
                      onClick={handleImageClick}
                      src={imagePreview || defaultImage}
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className={styles["data"]}>
                <div className={styles["flex-double"]}>
                  <Input
                    type="text"
                    label="Nombre"
                    placeholder=" "
                    labelPlacement="outside"
                    errorMessage={nombreError}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  ></Input>
                  <Spacer x={2} />
                  <Input
                    type="text"
                    label="Apellido"
                    placeholder=" "
                    errorMessage={apellidoError}
                    labelPlacement="outside"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                  ></Input>
                </div>

                <Spacer y={3} />

                <div className={styles["flex-double"]}>
                  <Input
                    type="text"
                    label="Correo Electrónico"
                    placeholder=" "
                    errorMessage={correoElectronicoError}
                    labelPlacement="outside"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                  ></Input>
                  <Spacer x={2} />

                  <Input
                    type="password"
                    label="Contraseña"
                    labelPlacement="outside"
                    placeholder=" "
                    errorMessage={passwordError}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Input>
                </div>
              </div>
            </div>
          </CardBody>
          <div className={styles["center-top"]}>
            <CardFooter className={styles["card-footer"]}>
              <Button color="primary" onClick={handleErrors}>
                Registrar Docente
              </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddDocente;
