import { jwtDecode } from "jwt-decode";
import cookie from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const USER_TYPE = {
  DOCENTE: "docente",
  ALUMNO: "alumno",
};

function DocenteElements(props: any) {
  const navigate = useNavigate();
  //obtener el token del cookie
  const accessToken = cookie.get("accessToken");
  //decodificar el token
  const decodedToken: any = jwtDecode(accessToken as string);

  const tipoUsuario = decodedToken.tipoUsuario;
  const userType = tipoUsuario;

  const url = `/`;

  const redirect = () => {
    useEffect(() => {
      navigate(url);
    }, []);
  };

  if (userType === USER_TYPE.DOCENTE) {
    return <div>{props.children}</div>;
  } else {
    redirect();
    return null;
  }
}

function AlumnoElements(props: any) {
  const navigate = useNavigate();
  //obtener el token del cookie
  const accessToken = cookie.get("accessToken");
  //decodificar el token
  const decodedToken: any = jwtDecode(accessToken as string);
  const tipoUsuario = decodedToken.tipoUsuario;
  const userType = tipoUsuario;

  const url = `/`;

  const redirect = () => {
    useEffect(() => {
      navigate(url);
    }, []);
  };

  if (userType === USER_TYPE.ALUMNO) {
    return <div>{props.children}</div>;
  } else {
    redirect();
    return null;
  }
}

function AdministradorElements(props: any) {
  const navigate = useNavigate();
  //obtener el token del cookie
  const accessToken = cookie.get("accessToken");
  //decodificar el token
  const decodedToken: any = jwtDecode(accessToken as string);
  const tipoUsuario = decodedToken.tipoUsuario;
  const userType = tipoUsuario;
  const isAdmin = JSON.parse(decodedToken.isAdmin);

  const url = `/`;

  const redirect = () => {
    useEffect(() => {
      navigate(url);
    }, []);
  };

  if (userType === USER_TYPE.DOCENTE && isAdmin === true) {
    return <div>{props.children}</div>;
  } else {
    redirect();
    return null;
  }
}

export { DocenteElements, AlumnoElements, AdministradorElements };
