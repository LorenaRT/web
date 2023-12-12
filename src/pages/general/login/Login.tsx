import { useState, useContext } from "react";
import {
  Button,
  Input,
  Image,
  Card,
  Spacer,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
} from "@nextui-org/react";
import service from "../../../services/db";
import { useTranslation } from "react-i18next";
import ModalRegister from "../signup/ModalSignUp";
import ModalUserCreated from "./modalUser/ModalUser";
import styles from "./Login.module.css";
import { AuthContext } from "../../../context/AuthContext";
import DefaultProfile from "../../../assets/profile.png";
import { toast } from "react-toastify";

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [emailValue, setEmailValue] = useState<any>("");
  const [passwordValue, setPasswordValue] = useState<any>("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modalSignUp, setModalSignUp] = useState(false);
  const [modalUserCreated, setModalUserCreated] = useState(false);
  const [userCreated, setUserCreated] = useState<any>("");
  const { t } = useTranslation();

  //Cierra el modal de SignUp
  const closeModalSignUp = (usuario?: any) => {
    setModalSignUp(false);

    //Si es un pressEvent, no se ha creado el usuario, no hacer nada
    if (usuario.type === "press") {
    } else {
      setUserCreated(usuario);
      openModalUserCreated();
    }
  };

  const closeModalUser = () => {
    setModalUserCreated(false);
  };

  //abre  el modal de SignUp
  const openModalSignUp = () => {
    setModalSignUp(true);
  };

  const openModalUserCreated = () => {
    setModalUserCreated(true);
  };

  const verifyErrors = () => {
    // Objeto para almacenar los mensajes de error
    const errors = {
      emailError: "",
      passwordError: "",
    };

    // Limpia los mensajes de error previos
    setEmailError("");
    setPasswordError("");

    // Validaciones de email
    if (emailValue === "") {
      errors.emailError = t("signIn.requiredEmail");
    }

    // Validación de contraseña
    if (passwordValue === "") {
      errors.passwordError = t("signIn.requiredPassword");
    }

    // Asigna los mensajes de error
    setEmailError(errors.emailError);
    setPasswordError(errors.passwordError);

    //si no hay errores, se llama a la función handleLogin
    if (errors.emailError === "" && errors.passwordError === "") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      const email = emailValue;
      const password = passwordValue;
      const response = await service.login(email, password);

      if (response.data && response.status === 200) {
        // Obtener el access token y el refresh token de la respuesta
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        // Llamar a la función login del AuthContext para establecer las cookies y el estado de autenticación
        login(accessToken, refreshToken);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        if (error.response.data.message === "Usuario no encontrado") {
          setEmailError(t("signIn.emailNotRegistered"));
        }
        if (error.response.data.message === "Credenciales inválidas") {
          setPasswordError(t("signIn.incorrectPassword"));
        }
      } else if (error.response && error.response.status === 403) {
        if (error.response.data.message === "No Verificado") {
          toast.error(t("signIn.notVerified"), {
            autoClose: false,
            position: "top-center",
          });
        }
      } else {
        console.log("Error en la solicitud. Compruebe su conexión a Internet.");
      }
    }
  };
  const handleSignUp = () => {
    //abrir el modal de registro
    openModalSignUp();
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["Card-Body"]}>
        <Card className={styles["Card"]}>
          <b className={styles["Text-Title"]}>{t("signIn.login")}</b>
          <CardHeader className="flex-col">
            <Image src={DefaultProfile} className={styles["Avatar"]} />
          </CardHeader>
          <CardBody>
            <Input
              className={styles["Input"]}
              label={t("signIn.email")}
              type="email"
              isClearable
              onValueChange={setEmailValue}
              errorMessage={emailError}
              value={emailValue || ""}
            />
            <Spacer y={1} />
            <Input
              className={styles["Input"]}
              label={t("signIn.password")}
              type="password"
              isClearable
              onValueChange={setPasswordValue}
              errorMessage={passwordError}
              value={passwordValue || ""}
            />
          </CardBody>
          <CardFooter>
            <Button
              className={styles["Button"]}
              color="primary"
              onPress={verifyErrors}
            >
              {t("signIn.login")}
            </Button>
          </CardFooter>

          <Link
            onClick={handleSignUp}
            style={{
              cursor: "pointer",
            }}
          >
            {t("¿Eres alumno? Registrate aquí")}
          </Link>
        </Card>
        {modalSignUp && <ModalRegister onClose={closeModalSignUp as any} />}

        {modalUserCreated && (
          <ModalUserCreated
            usuario={{ usuario: userCreated }}
            onClose={closeModalUser as any}
          />
        )}
      </div>
    </div>
  );
};

export default LoginForm;
