import http from "../api/axios";

class UserService {
  //registrar usuario
  registrar(data: any) {
    return http.post("/sign-up-user", data);
  }

  // Comprobar si el useristrador existe en la base de datos y si la contraseña es correcta sin credenciales
  login(correoElectronico: string, userPassword: string) {
    return http.get(
      `/user/login?correoElectronico=${correoElectronico}&userPassword=${userPassword}`,
      { withCredentials: false }
    );
  }

  // Refrescar el token de usuario
  refreshToken(refreshToken: any) {
    return http.get(`/user/refreshToken?refreshToken=${refreshToken}`, {
      withCredentials: false,
    });
  }

  getProfileImage(idUsuario: string) {
    return http.get(`/user/get-profile-image/${idUsuario}`, {
      responseType: "blob",
    });
  }

  registraLibro(data: any) {
    return http.post("/add-new-libro", data);
  }

  //Subir imagen de libro
  agregarImagenLibro(idLibro: number, image: any) {
    return http.post(`/upload-book-image/${idLibro}`, image, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  //obtener todos los libros
  getAllBooks() {
    return http.get("/get-all-books");
  }

  //obtener la imagen de un libro por id
  getBookImage(idLibro: number) {
    return http.get(`/get-book-image/${idLibro}`, {
      responseType: "blob",
    });
  }

  //editar libro
  editBook(data: any) {
    return http.put("/edit-book", data);
  }

  //para eliminar un libro
  EliminarLibro(idLibro: number) {
    return http.delete(`/delete-book/${idLibro}`);
  }

  //Registrar docente
  registraDocente(data: any) {
    return http.post("/add-new-docente", data);
  }

  //agregarImagenDocente
  agregarImagenDocente(idDocente: number, image: any) {
    return http.post(`/upload-docente-image/${idDocente}`, image, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  //Subir imagen de perfil
  uploadProfileImagenDocente(idUsuario: string, image: any) {
    return http.post(`/upload-docente-image/${idUsuario}`, image, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  //actualizar docente
  updateDocente(data: any) {
    return http.put("/edit-docente", data);
  }

  //obtener los datos del docente
  getDocenteData(idUsuario: string) {
    return http.get(`/get-docente-data/${idUsuario}`);
  }

  //obtener todos los alumnos
  getAllAlumnos() {
    return http.get("/get-all-alumnos");
  }

  //editar alumno
  editAlumno(data: any) {
    return http.put("/edit-alumno", data);
  }

  //eliminar alumno
  deleteAlumno(idAlumno: number) {
    return http.delete(`/delete-alumno/${idAlumno}`);
  }

  registrarPrestamo(data: any) {
    return http.post("/add-new-prestamo-libro", data);
  }

  //obtener todos los prestamos
  getAllBooksPrestamos() {
    return http.get("/get-all-books-prestamos");
  }

  //terminar el prestamo
  terminarPrestamo(idPrestamo: number) {
    return http.put(`/terminar-prestamo/${idPrestamo}`);
  }

  //obtener todos los prestamos de un alumno
  getMisLibrosEnPrestamo(idAlumno: number) {
    return http.get(`/get-all-books-prestamos-alumno/${idAlumno}`);
  }

  //obtener la informacion del alumno
  getAlumnoData(idUsuario: string) {
    return http.get(`/get-alumno-data/${idUsuario}`);
  }

  //mandar solicitud de prestao de libro
  solicitarLibro(idAlumno: number, idLibro: number) {
    return http.post(`/solicitar-libro/${idAlumno}/${idLibro}`);
  }

  //obtener las solicitudes de prestamo de un alumno
  getMisSolicitudesPrestamo(idAlumno: number) {
    return http.get(`/get-mis-solicitudes-prestamo/${idAlumno}`);
  }

  //obtener todas las solicitudes de prestamo
  getAllSolicitudesPrestamo() {
    return http.get("/get-all-solicitudes-prestamo");
  }

  procesarSolicitud(idSolicitud: number, respuesta: string) {
    return http.put(`/procesar-solicitud/${idSolicitud}/${respuesta}`);
  }

  //aumentar grado de alumnos

  aumentarGradoAlumnos() {
    return http.put("/aumentar-grado-alumnos");
  }
}

const UserServiceInstance = new UserService();
export default UserServiceInstance;
