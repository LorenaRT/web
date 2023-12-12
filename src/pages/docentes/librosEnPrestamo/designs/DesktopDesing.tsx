import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import styles from "../MisLibrosEnPrestamo.module.css";
import ModalBookInfo from "../modals/bookInfo/ModalBookInfo";
import ModalInfoPrestamo from "../modals/infoPrestamos/ModalnfoPrestamos";
import ModalEditBook from "../modals/bookEdit/ModalBookEdit";
import ModalConfirm from "../modals/modalConfirm/ModalConfirm";
import { useTranslation } from "react-i18next";
import { BsTrash } from "react-icons/bs";
interface TableProps {
  prestamo: any[];
  updateBooks: () => void;
}

export default function BookList({ prestamo, updateBooks }: TableProps) {
  type Book = (typeof prestamo)[0];
  const [page, setPage] = React.useState(1);
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>();
  const [modalBookInfo, setModalBookInfo] = useState<any>(false);
  const [modalInfoPrestamo, setModalInfoPrestamo] = useState<any>(false);
  const [modalEditBook, setModalEditBook] = useState<any>(false);
  const [modalConfirm, setModalConfirm] = useState<any>(false);

  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending" | undefined;
  }>({
    column: "",
    direction: undefined,
  });

  useEffect(() => {
    if (prestamo == null) {
      return;
    }
    setPrestamos(prestamo);
  }, [prestamo]);

  const { t } = useTranslation();
  //Cierra el modal de Informacion de prestamo
  const closeModalBookInfo = () => {
    setModalBookInfo(false);
  };

  //Cierra el modal
  const closeModalInfoPrestamo = () => {
    setModalInfoPrestamo(false);
  };

  //Cierra el modal
  const closeModalEditBook = () => {
    setModalEditBook(false);
  };

  //Cierra el modal
  const closeModalConfirm = () => {
    setModalConfirm(false);
  };

  //abre  el modal de Informacion de prestamo
  const openModalBookInfo = (prestamo: any) => {
    setSelectedBook(prestamo);
    setModalBookInfo(true);
  };

  //abre  el modal de confirmacion de eliminar prestamo
  const openModalConfirm = (prestamo: any) => {
    setSelectedBook(prestamo);
    setModalConfirm(true);
  };

  const handleSelectionItem = (key: string, libros: any) => {
    // Obtener el prestamo de la clave seleccionada
    const selectedBook = libros.find(
      (prestamo: any) => JSON.parse(prestamo.idLibro) === Number(key)
    );

    //si el prestamo existe entonces abre el modal de información de prestamo
    if (selectedBook) {
      openModalBookInfo(selectedBook);
    }
  };

  function capitalizeFirstLetter(str: any) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  function formatearFecha(fecha: any) {
    const fechaObj = new Date(fecha);

    // Obtener componentes de la fecha
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1; // Nota: en JavaScript, los meses comienzan desde 0
    const year = fechaObj.getFullYear();
    let hora = fechaObj.getHours();
    const minutos = fechaObj.getMinutes();

    // Determinar si es AM o PM
    const periodo = hora >= 12 ? "PM" : "AM";

    // Convertir a formato de 12 horas
    hora = hora % 12 || 12;

    // Agregar ceros iniciales si es necesario
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    const horaFormateada = hora < 10 ? `0${hora}` : hora;
    const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;

    // Crear la cadena formateada
    const fechaFormateada = `${diaFormateado}/${mesFormateado}/${year}, ${horaFormateada}:${minutosFormateados} ${periodo}`;

    return fechaFormateada;
  }

  const renderCell = React.useCallback(
    (prestamo: Book, columnKey: React.Key) => {
      const cellValue = prestamo[columnKey as keyof Book];

      switch (columnKey) {
        case "nombres":
          return (
            <div className="flex flex-col">
              <span>
                {capitalizeFirstLetter(cellValue) +
                  " " +
                  capitalizeFirstLetter(prestamo.apellidos)}
              </span>
            </div>
          );

        case "fechaPrestamo":
          return (
            <div className="flex flex-col">
              <span>{formatearFecha(cellValue)}</span>
            </div>
          );

        case "nombreLibro":
          return (
            <div className="flex flex-col">
              <span>{capitalizeFirstLetter(cellValue)}</span>
            </div>
          );

        case "autor":
          return (
            <div className="flex flex-col">
              <span>{capitalizeFirstLetter(cellValue)}</span>
            </div>
          );

        case "actions":
          return (
            <div className="flex gap-4">
              {/* <Tooltip content={t("Editar")}>
                <span
                  onClick={() => openModalEditBook(prestamo)}
                  className="cursor-pointer active:opacity-50"
                >
                  <AiFillEdit size={23} />
                </span>
              </Tooltip> */}

              {/* <Tooltip content={t("Agregar Prestamo")}>
                <span
                  onClick={() => openModalInfoPrestamo(prestamo)}
                  className="cursor-pointer active:opacity-50"
                >
                  <AiOutlinePlus size={23} />
                </span>
              </Tooltip> */}

              <Tooltip content={t("Terminar Prestamo")}>
                <span
                  onClick={() => openModalConfirm(prestamo)}
                  className="cursor-pointer active:opacity-50"
                >
                  <BsTrash size={23} />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const columns = [
    //nombres y apellidos
    { name: t("Nombre del Libro"), uid: "nombreLibro" },
    { name: t("Autor"), uid: "autor" },
    { name: t("Alumno"), uid: "nombres" },
    { name: t("Fecha de Prestamo"), uid: "fechaPrestamo" },
    { name: t("Acciones"), uid: "actions" },
  ];

  // Ordenar los valores calculados según la columna seleccionada
  const sortData = useMemo(() => {
    if (!prestamos) {
      return [];
    }

    return [...prestamos].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
  }, [sortDescriptor, prestamos]);

  const rowsPerPage = 16;
  const pages = Math.ceil(sortData.length / rowsPerPage);

  //paginacion de la tabla de libros ordenados
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortData.slice(start, end);
  }, [page, rowsPerPage, sortData]);

  return (
    <div className={styles["body"]}>
      <Table
        isStriped
        onRowAction={(key: any) => handleSelectionItem(key, prestamo)}
        color="primary"
        selectionMode="single"
        className={styles["table"]}
        aria-label="tabla-libros"
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor: any) => {
          setSortDescriptor(descriptor);
        }}
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader className={styles["table-header"]} columns={columns}>
          {(column) => (
            <TableColumn
              allowsSorting={column.uid !== "actions"}
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody className={styles["table-body"]} items={items}>
          {(item: any) => (
            <TableRow key={item.idLibro}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {modalBookInfo && (
        <ModalBookInfo onClose={closeModalBookInfo} prestamo={selectedBook} />
      )}

      {modalConfirm && (
        <ModalConfirm
          onClose={closeModalConfirm}
          prestamo={selectedBook}
          updateBooks={updateBooks}
        />
      )}

      {modalEditBook && (
        <ModalEditBook
          onClose={closeModalEditBook}
          libro={selectedBook}
          updateBooks={updateBooks}
        />
      )}

      {modalInfoPrestamo && (
        <ModalInfoPrestamo
          onClose={closeModalInfoPrestamo}
          prestamos={selectedBook}
        />
      )}
    </div>
  );
}
