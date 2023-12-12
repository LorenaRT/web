import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Image,
  Textarea,
  Spacer,
} from "@nextui-org/react";
import styles from "./AgregarLibro.module.css";
import { useState, useRef, useEffect } from "react";
import db from "../../../services/db";
import { toast } from "react-toastify";
import defaultImage from "../../../assets/defaultBook.png";

const AddLibro = () => {
  const [nombreLibro, setNombreLibro] = useState("");
  const [autor, setAutor] = useState("");
  const [editorial, setEditorial] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaPublicacion, setFechaPublicacion] = useState();
  const [paginas, setPaginas] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [imagen, setImagen] = useState();
  const [descripcion, setDescripcion] = useState("");

  const [nombreLibroError, setNombreLibroError] = useState("");
  const [autorError, setAutorError] = useState("");
  const [editorialError, setEditorialError] = useState("");
  const [generoError, setGeneroError] = useState("");
  const [cantidadError, setCantidadError] = useState("");

  const [imagePreview, setImagePreview] = useState<string | undefined>(imagen);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (nombreLibro.trim() === "") {
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
    console.log(cantidad);
    if (Number(cantidad) <= 0) {
      errors.cantidadError = "La cantidad es requerida";
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
    handleAddLibro();
  };

  const handleAddLibro = async () => {
    //si la fecha de publicacion esta vacia setearla a null
    if (fechaPublicacion === "") {
      setFechaPublicacion(null as any);
    }
    try {
      const libro = {
        nombreLibro,
        autor,
        editorial,
        genero,
        fechaPublicacion,
        paginas,
        cantidad,
        descripcion,
      };

      const response = await db.registraLibro(libro);

      //si response status es 200 agregar la imagen al libro
      if (response.status === 200 && response.data.idLibro && imagen) {
        const responseImagen = await db.agregarImagenLibro(
          response.data.idLibro,
          imagen
        );
        if (responseImagen.status === 200) {
          toast.success("Libro agregado correctamente");
          setNombreLibro("");
          setAutor("");
          setEditorial("");
          setGenero("");
          setFechaPublicacion(null as any);
          setPaginas("");
          setCantidad(0);
          setDescripcion("");
          setImagePreview(undefined);
        }
      } else if (response.data.message === "Libro agregado exitosamente") {
        toast.success("Libro agregado correctamente");
        setNombreLibro("");
        setAutor("");
        setEditorial("");
        setGenero("");
        setFechaPublicacion(null as any);
        setPaginas("");
        setCantidad(0);
        setDescripcion("");
        setImagePreview(undefined);
      }
    } catch (error) {
      console.log(error);
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
              <h1 className={styles["title"]}>Agregar Libro</h1>
            </CardHeader>
          </div>
          <CardBody className={styles["card-body"]}>
            <div className={styles["layoutData"]}>
              <div className={styles["imagen"]}>
                <div>
                  <Image
                    isZoomed
                    width={240}
                    className={styles["img"]}
                    onClick={handleImageClick}
                    src={imagePreview || defaultImage}
                  />
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
                    label="*Nombre del Libro"
                    placeholder=" "
                    labelPlacement="outside"
                    errorMessage={nombreLibroError}
                    value={nombreLibro}
                    onChange={(e) => setNombreLibro(e.target.value)}
                  ></Input>
                  <Spacer x={2} />
                  <Input
                    type="text"
                    label="*Autor"
                    placeholder=" "
                    errorMessage={autorError}
                    labelPlacement="outside"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                  ></Input>
                </div>
                <Spacer y={3} />

                <div className={styles["flex-double"]}>
                  <Input
                    type="text"
                    label="*Editorial"
                    placeholder=" "
                    errorMessage={editorialError}
                    labelPlacement="outside"
                    value={editorial}
                    onChange={(e) => setEditorial(e.target.value)}
                  ></Input>
                  <Spacer x={2} />
                  <Input
                    type="text"
                    label="*Genero"
                    placeholder=" "
                    errorMessage={generoError}
                    labelPlacement="outside"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                  ></Input>
                </div>

                <Spacer y={3} />

                <div className={styles["flex-double"]}>
                  <Input
                    type="number"
                    label="*Cantidad"
                    labelPlacement="outside"
                    placeholder="Cantidad"
                    errorMessage={cantidadError}
                    value={cantidad.toString()}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                  ></Input>
                  <Spacer x={2} />
                  <Input
                    type="number"
                    label="Paginas"
                    placeholder=" "
                    labelPlacement="outside"
                    value={paginas}
                    onChange={(e) => setPaginas(e.target.value)}
                  ></Input>
                </div>
                <Spacer y={3} />

                <div className={styles["flex-double"]}>
                  <Input
                    type="date"
                    label="Fecha de Publicacion"
                    labelPlacement="outside"
                    placeholder="Fecha de Publicacion"
                    value={fechaPublicacion}
                    onChange={(e) => setFechaPublicacion(e.target.value as any)}
                  ></Input>
                  <Spacer x={2} />
                </div>
                <Spacer y={3} />

                <div className={styles["flex-double"]}>
                  <Textarea
                    type="text"
                    label="Descripcion"
                    labelPlacement="outside"
                    placeholder=" "
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  ></Textarea>
                  <Spacer x={2} />
                </div>
              </div>
            </div>
          </CardBody>
          <div className={styles["center-top"]}>
            <CardFooter className={styles["card-footer"]}>
              <Button color="primary" onClick={handleErrors}>
                Agregar Libro
              </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddLibro;
