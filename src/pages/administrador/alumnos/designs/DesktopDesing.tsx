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
  Button,
} from "@nextui-org/react";
import styles from "../Alumnos.module.css";
import ModalBookInfo from "../modals/alumnoInfo/ModalAlumnoInfo";
import ModalEditBook from "../modals/alumnoEdit/ModalAlumnoEdit";
import ModalConfirm from "../modals/modalConfirm/ModalConfirm";
import ModalConfirmGrado from "../modals/modalConfirmGrado/ModalConfirm";
import { useTranslation } from "react-i18next";
import { AiFillEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
interface TableProps {
  alumnos: any[];
  updateAlumnos: () => void;
}

export default function BookList({ alumnos, updateAlumnos }: TableProps) {
  type Alumnos = (typeof alumnos)[0];
  const [page, setPage] = React.useState(1);
  const [dataAlumnos, setDataAlumnos] = useState<any[]>([]);
  const [selectedAlumno, setSelectedBook] = useState<any>();
  const [modalBookInfo, setModalBookInfo] = useState<any>(false);
  const [modalEditBook, setModalEditBook] = useState<any>(false);
  const [modalConfirm, setModalConfirm] = useState<any>(false);
  const [modalConfirmGrado, setModalConfirmGrado] = useState<any>(false);

  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending" | undefined;
  }>({
    column: "",
    direction: undefined,
  });

  useEffect(() => {
    if (alumnos == null) {
      return;
    }
    setDataAlumnos(alumnos);
  }, [alumnos]);

  const { t } = useTranslation();
  //Cierra el modal de Informacion de alumnos
  const closeModalBookInfo = () => {
    setModalBookInfo(false);
  };

  //Cierra el modal
  const closeModalEditBook = () => {
    setModalEditBook(false);
  };

  //Cierra el modal
  const closeModalConfirm = () => {
    setModalConfirm(false);
  };

  const closeModalConfirmGrado = () => {
    setModalConfirmGrado(false);
  };

  //abre  el modal de Informacion de alumnos
  const openModalBookInfo = (alumnos: any) => {
    setSelectedBook(alumnos);
    setModalBookInfo(true);
  };

  //abre  el modal de editar alumnos
  const openModalEditBook = (alumnos: any) => {
    setSelectedBook(alumnos);
    setModalEditBook(true);
  };

  //abre  el modal de confirmacion de eliminar alumnos
  const openModalConfirm = (alumnos: any) => {
    setSelectedBook(alumnos);
    setModalConfirm(true);
  };

  //abre  el modal de confirmacion de aumentar grado
  const openModalConfirmGrado = () => {
    setModalConfirmGrado(true);
  };

  const handleSelectionItem = (key: string, alumnos: any) => {
    // Obtener el alumnos de la clave seleccionada
    const selectedAlumno = alumnos.find(
      (alumnos: any) => JSON.parse(alumnos.idAlumno) === Number(key)
    );

    //si el alumnos existe entonces abre el modal de información de alumnos
    if (selectedAlumno) {
      openModalBookInfo(selectedAlumno);
    }
  };

  const renderCell = React.useCallback(
    (alumnos: Alumnos, columnKey: React.Key) => {
      const cellValue = alumnos[columnKey as keyof Alumnos];

      switch (columnKey) {
        case "nombres":
          return (
            <div className="flex gap-4">
              <p className="text-md ">
                {" "}
                {cellValue} {alumnos.apellidos}
              </p>
            </div>
          );
        case "usuario":
          return (
            <div className="flex gap-4">
              <p className="text-md "> {cellValue}</p>
            </div>
          );
        case "grado":
          return (
            <div className="flex gap-4">
              <p className={`text-md ${cellValue > 6 ? "text-red-500" : ""}`}>
                {cellValue}
              </p>
            </div>
          );
        case "actions":
          return (
            <div className="flex gap-4">
              <Tooltip content={t("Editar")}>
                <span
                  onClick={() => openModalEditBook(alumnos)}
                  className="cursor-pointer active:opacity-50"
                >
                  <AiFillEdit size={23} />
                </span>
              </Tooltip>

              <Tooltip content={t("Eliminar alumno")}>
                <span
                  onClick={() => openModalConfirm(alumnos)}
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
    { name: t("Nombre del Alumno"), uid: "nombres" },
    { name: t("Usuario"), uid: "usuario" },
    { name: t("Grado"), uid: "grado" },
    { name: t("Acciones"), uid: "actions" },
  ];

  // Ordenar los valores calculados según la columna seleccionada
  const sortData = useMemo(() => {
    if (!dataAlumnos) {
      return [];
    }

    return [...dataAlumnos].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
  }, [sortDescriptor, dataAlumnos]);

  const rowsPerPage = 12;
  const pages = Math.ceil(sortData.length / rowsPerPage);

  //paginacion de la tabla de alumnos ordenados
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortData.slice(start, end);
  }, [page, rowsPerPage, sortData]);

  return (
    <div className={styles["body"]}>
      <div className={styles["flex-end"]}>
        <Button
          className={styles["button"]}
          color="warning"
          onClick={() => openModalConfirmGrado()}
        >
          {t("Aumentar Grado")}
        </Button>
      </div>
      <Table
        isStriped
        onRowAction={(key: any) => handleSelectionItem(key, alumnos)}
        color="primary"
        selectionMode="single"
        className={styles["table"]}
        aria-label="tabla-alumnos"
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
            <TableRow key={item.idAlumno}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {modalBookInfo && (
        <ModalBookInfo onClose={closeModalBookInfo} alumnos={selectedAlumno} />
      )}

      {modalConfirm && (
        <ModalConfirm
          onClose={closeModalConfirm}
          alumnos={selectedAlumno}
          updateAlumnos={updateAlumnos}
        />
      )}

      {modalEditBook && (
        <ModalEditBook
          onClose={closeModalEditBook}
          alumnos={selectedAlumno}
          updateAlumnos={updateAlumnos}
        />
      )}

      {modalConfirmGrado && (
        <ModalConfirmGrado
          onClose={closeModalConfirmGrado}
          updateAlumnos={updateAlumnos}
        />
      )}
    </div>
  );
}
