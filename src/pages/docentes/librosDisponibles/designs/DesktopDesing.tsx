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
import styles from "../MisLibros.module.css";
import ModalBookInfo from "../modals/bookInfo/ModalBookInfo";
import ModalAddPrestamo from "../modals/addPrestamo/ModalAddPrestamo";
import ModalEditBook from "../modals/bookEdit/ModalBookEdit";
import ModalConfirm from "../modals/modalConfirm/ModalConfirm";
import { useTranslation } from "react-i18next";
import { AiFillEdit } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";

interface TableProps {
  libro: any[];
  updateBooks: () => void;
}

export default function BookList({ libro, updateBooks }: TableProps) {
  type Book = (typeof libro)[0];
  const [page, setPage] = React.useState(1);
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>();
  const [modalBookInfo, setModalBookInfo] = useState<any>(false);
  const [modalAddPrestamo, setModalAddPrestamo] = useState<any>(false);
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
    if (libro == null) {
      return;
    }
    setBooks(libro);

    setSortDescriptor({
      column: "titulo",
      direction: "ascending",
    });
  }, [libro]);

  const { t } = useTranslation();
  //Cierra el modal de Informacion de libro
  const closeModalBookInfo = () => {
    setModalBookInfo(false);
  };

  //Cierra el modal
  const closemodalAddPrestamo = () => {
    setModalAddPrestamo(false);
    updateBooks();
  };

  //Cierra el modal
  const closeModalEditBook = () => {
    setModalEditBook(false);
  };

  //Cierra el modal
  const closeModalConfirm = () => {
    setModalConfirm(false);
  };

  //abre  el modal de Informacion de libro
  const openModalBookInfo = (libro: any) => {
    setSelectedBook(libro);
    setModalBookInfo(true);
  };

  //abre  el modal de editar libro
  const openModalEditBook = (libro: any) => {
    setSelectedBook(libro);
    setModalEditBook(true);
  };

  //abre  el modal de confirmacion de eliminar libro
  const openModalConfirm = (libro: any) => {
    setSelectedBook(libro);
    setModalConfirm(true);
  };

  //abre  el modal de Informacion de libro
  const openmodalAddPrestamo = (libro: any) => {
    setSelectedBook(libro);
    setModalAddPrestamo(true);
  };

  const handleSelectionItem = (key: string, libros: any) => {
    // Obtener el libro de la clave seleccionada
    const selectedBook = libros.find(
      (libro: any) => JSON.parse(libro.idLibro) === Number(key)
    );

    //si el libro existe entonces abre el modal de información de libro
    if (selectedBook) {
      openModalBookInfo(selectedBook);
    }
  };

  const renderCell = React.useCallback((libro: Book, columnKey: React.Key) => {
    const cellValue = libro[columnKey as keyof Book];

    switch (columnKey) {
      case "nombres":
        return <></>;
      case "actions":
        return (
          <div className="flex gap-4">
            <Tooltip content={t("Editar")}>
              <span
                onClick={() => openModalEditBook(libro)}
                className="cursor-pointer active:opacity-50"
              >
                <AiFillEdit size={23} />
              </span>
            </Tooltip>

            <Tooltip content={t("Agregar Prestamo")}>
              <span
                onClick={() => openmodalAddPrestamo(libro)}
                className="cursor-pointer active:opacity-50"
              >
                <AiOutlinePlus size={23} />
              </span>
            </Tooltip>

            <Tooltip content={t("Eliminar Libros")}>
              <span
                onClick={() => openModalConfirm(libro)}
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
  }, []);

  const columns = [
    //nombres y apellidos
    { name: t("Nombre del Libro"), uid: "titulo" },
    { name: t("Autor"), uid: "autor" },
    { name: t("Editorial"), uid: "editorial" },
    { name: t("Genero"), uid: "genero" },
    { name: t("Cantidad"), uid: "cantidad" },
    { name: t("Acciones"), uid: "actions" },
  ];

  // Ordenar los valores calculados según la columna seleccionada
  const sortData = useMemo(() => {
    if (!books) {
      return [];
    }

    return [...books].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
  }, [sortDescriptor, books]);

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
        onRowAction={(key: any) => handleSelectionItem(key, libro)}
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
        <ModalBookInfo onClose={closeModalBookInfo} libro={selectedBook} />
      )}

      {modalConfirm && (
        <ModalConfirm
          onClose={closeModalConfirm}
          libro={selectedBook}
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

      {modalAddPrestamo && (
        <ModalAddPrestamo
          onClose={closemodalAddPrestamo}
          libro={selectedBook}
        />
      )}
    </div>
  );
}
