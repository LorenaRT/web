import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Select,
  SelectItem,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import service from "../../../services/db";
import { useTranslation } from "react-i18next";
import styles from "./SignUp.module.css";
import { toast } from "react-toastify";

interface AgregarUsuarioProps {
  onClose: (usuario?: any) => void;
}

const GRADOS = [
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
];

const ModalRegisterUser: React.FC<AgregarUsuarioProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [nombreValue, setNombreValue] = useState<any>("");
  const [apellidosValue, setApellidosValue] = useState<any>("");
  const [passwordValue, setPasswordValue] = useState<any>("");
  const [gradoValue, setGradoValue] = useState<any>("");

  const [nombreError, setNombreError] = useState("");
  const [apellidosError, setApellidosError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [gradoError, setGradoError] = useState("");
  const [isLoading, setIsLoadingg] = useState(false);

  const closeHandler = (usuario: any) => {
    setVisible(false);
    onClose(usuario as string);
  };

  const validarNombre = (nombre: string) => {
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(nombre)) {
      return t("signUp.onlyNameLetters");
    }
    return "";
  };

  const validarApellidos = (apellidos: string) => {
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(apellidos)) {
      return t("signUp.onlyLastNameLetters");
    }
    return "";
  };

  //validar que la contrasena tenga al menos 6 caracteres y al menos una letra y un numero y que no sea consecutiva
  const validarContrasena = (contrasena: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!regex.test(contrasena)) {
      return t("signUp.contrasenaInvalida");
    }
    return "";
  };

  const validateErrors = () => {
    let valid = true;

    if (!nombreValue) {
      setNombreError(t("signUp.requiredName"));
      valid = false;
    } else {
      const nombreError = validarNombre(nombreValue);
      if (nombreError) {
        setNombreError(nombreError);
        valid = false;
      } else {
        setNombreError("");
      }
    }

    if (!apellidosValue) {
      setApellidosError(t("signUp.requiredLastName"));
      valid = false;
    } else {
      const apellidosError = validarApellidos(apellidosValue);
      if (apellidosError) {
        setApellidosError(apellidosError);
        valid = false;
      } else {
        setApellidosError("");
      }
    }

    if (!gradoValue) {
      setGradoError(t("signUp.requiredGrado"));
      valid = false;
    } else {
      setGradoError("");
    }

    if (!passwordValue) {
      setPasswordError(t("signUp.requiredPassword"));
      valid = false;
    } else {
      const passwordError = validarContrasena(passwordValue);
      if (passwordError) {
        setPasswordError(passwordError);
        valid = false;
      } else {
        setPasswordError("");
      }
    }
    //si no hay errores llama a la funcion agregarUsuarioHandler
    if (valid) {
      agregarUsuarioHandler();
    }
  };

  const agregarUsuarioHandler = async () => {
    const data = {
      nombres: nombreValue,
      apellidos: apellidosValue,
      password: passwordValue,
      grado: gradoValue,
    };

    try {
      setIsLoadingg(true);
      const response = await service.registrar(data);
      console.log(response);
      if (response.status === 200 && response.data.usuario) {
        const toastContent = t("Registro Completado");
        localStorage.setItem("confirmationToast", toastContent);
        toast.success(t("Registro Completado"), {
          autoClose: false,
        });
        closeHandler(response.data.usuario);
      } else {
        //Usuario no agregado
        console.log(response.data);
      }
    } catch (error: any) {
      setIsLoadingg(false);
      if (error.response && error.response.status === 400) {
        //para la lista de errores que halla si type=correo o type= phone
        const errors = error.response.data.errors;
        for (const error of errors) {
          if (error.type === "usuario") {
          }
        }
      } else {
        console.log(error);
      }
    }
  };

  return (
    <Modal
      isOpen={visible}
      className={styles["Modal-SignUp"]}
      aria-labelledby="modal-signup"
      onClose={closeHandler as any}
      backdrop="blur"
      isDismissable={false}
      size="lg"
    >
      <ModalContent>
        <>
          <ModalHeader className={styles["SignUp-Modal-Header"]}>
            <b className={styles["SignUp-Text-Title"]}>{t("signUp.signUp")}</b>
          </ModalHeader>{" "}
          <ModalBody>
            <div className={styles["Body-Name-Pass"]}>
              <div className={styles["Name-Container"]}>
                <Input
                  isClearable
                  label={t("signUp.name")}
                  className={styles["SignUp-Input"]}
                  aria-labelledby="Nombre"
                  onValueChange={setNombreValue}
                  value={nombreValue}
                  errorMessage={nombreError}
                />
              </div>

              <div className={styles["LastName-Container"]}>
                <Input
                  isClearable
                  label={t("signUp.lastName")}
                  className={styles["SignUp-Input"]}
                  aria-labelledby="Apellidos"
                  onValueChange={setApellidosValue}
                  value={apellidosValue}
                  errorMessage={apellidosError}
                />
              </div>
            </div>
            <Select
              items={GRADOS}
              label="Seleccione el grado"
              placeholder="Seleccione el grado"
              className="max-w"
              errorMessage={gradoError}
              onChange={(value) => setGradoValue(value.target.value)}
            >
              {(grado) => (
                <SelectItem key={grado.value}>{grado.label}</SelectItem>
              )}
            </Select>

            <Input
              isClearable
              label={t("signUp.password")}
              className={styles["SignUp-Input"]}
              aria-labelledby="Contraseña"
              type="password"
              onValueChange={setPasswordValue}
              value={passwordValue}
              errorMessage={passwordError}
            />
          </ModalBody>
          <ModalFooter className={styles["SignUp-Modal-Footer"]}>
            <Button
              isLoading={isLoading}
              className={styles["SignUp-Button"]}
              color="primary"
              onPress={validateErrors}
              size="lg"
            >
              {isLoading ? t("signUp.registering") : t("signUp.signUp")}
            </Button>
            <Button
              isDisabled={isLoading}
              size="lg"
              className={styles["SignUp-Button"]}
              color="danger"
              onPress={closeHandler as any}
            >
              {t("signUp.cancel")}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalRegisterUser;
