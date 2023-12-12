import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import styles from "./ModalInfoPrestamos.module.css";
import ModalHistorialPagos from "./ModalHistorialPrestamos";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface InfoUserProps {
  onClose: () => void;
  prestamos: any;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({ onClose, prestamos }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  type HistorialPagos = (typeof prestamos)[0];
  const [selectedPrestamo, setSelectedPrestamo] = useState<any>();
  const [modalUserInfo, setModalUserInfo] = useState<any>(false);
  const [page, setPage] = useState(1);
  const [historialPagos, setHistorialPagos] = useState<any[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending" | undefined;
  }>({
    column: "",
    direction: undefined,
  });

  useEffect(() => {
    if (prestamos !== null) {
      setHistorialPagos(prestamos.prestamos);
    }
  }, [prestamos]);

  //Cierra el modal de Informacion de prestamos
  const closeModalUserInfo = () => {
    setModalUserInfo(false);
  };

  //abre  el modal de Informacion de prestamos
  const openModalUserInfo = (prestamo: any) => {
    setSelectedPrestamo(prestamo);
    setModalUserInfo(true);
  };

  const handleSelectionItem = (key: string, prestamos: any) => {
    // Obtener el prestamo de la clave seleccionada
    const selectedPrestamo = prestamos.find(
      (prestamo: any) => JSON.parse(prestamo.idPrestamo) === Number(key)
    );

    //si el prestamos existe entonces abre el modal de información de prestamos
    if (selectedPrestamo) {
      openModalUserInfo(selectedPrestamo);
    }
  };

  const formatDate = (date: string) => {
    if (!date) {
      return ""; // o cualquier otro manejo apropiado para valores nulos o indefinidos
    }

    const fecha = new Date(date);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleString("en-EN", { month: "long" });
    const year = fecha.getFullYear();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const ampm = hora >= 12 ? "p.m." : "a.m.";
    let hora12 = hora % 12;
    if (hora12 === 0) {
      hora12 = 12;
    }
    const minutosFormateados = minutos < 10 ? "0" + minutos : minutos;
    const horaFormateada = hora12 + ":" + minutosFormateados + " " + ampm;

    return (
      <span>
        {`${dia} ${t("completeMonth." + mes)} ${year} ${horaFormateada}`}{" "}
      </span>
    );
  };
  const renderCell = React.useCallback(
    (historialPagos: HistorialPagos, columnKey: React.Key) => {
      //obtener la token de las cookies
      const token = Cookies.get("accessToken");
      if (!token) {
        return;
      }
      //decodificar el token
      const decodedToken = jwtDecode(token!) as any;
      //setear si el usuario esta activo o no
      let isActive = JSON.parse(decodedToken.isActive);

      const cellValue = historialPagos[columnKey as keyof HistorialPagos];
      switch (columnKey) {
        case "montoPrestado":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {(Number(cellValue), isActive)}
              </p>
            </div>
          );
        case "fechaPrestamo":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{formatDate(cellValue)}</p>
            </div>
          );
        case "fechaFinPago":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{formatDate(cellValue)}</p>
            </div>
          );
      }
    },
    []
  );

  const columns = [
    //nombres y apellidos
    { name: t("tables.cantidadPrestada"), uid: "montoPrestado" },
    { name: t("tables.fechaInicio"), uid: "fechaPrestamo" },
    { name: t("tables.fechaFin"), uid: "fechaFinPago" },
  ];

  const sortedItems = useMemo(() => {
    if (!historialPagos) {
      return prestamos;
    }
    return [...historialPagos].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, historialPagos]);

  const rowsPerPage = 5;
  const pages = Math.ceil(sortedItems.length / rowsPerPage);

  //paginacion de la tabla de usuarios ordenados
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [page, rowsPerPage, sortedItems]);

  const closeHandler = () => {
    setVisible(false);
    onClose();
  };

  return (
    <Modal
      size="4xl"
      isOpen={visible}
      aria-labelledby="modal-signup"
      onClose={closeHandler}
      backdrop="blur"
      isDismissable={false}
      scrollBehavior="inside"
      placement="auto"
      className={styles["modal"]}
    >
      <ModalContent>
        <>
          <ModalHeader className={styles["modal-header"]}>
            {t("otros.infoPrestamos")}
            <div className={styles["card-data"]}>
              <div className={styles["text-center"]}>
                <p className="text-small text-default-500">
                  {t("profile.name")}
                </p>

                <p className="text-md ">
                  {prestamos.nombres + " " + prestamos.apellidos}
                </p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <Table
              isStriped
              onRowAction={(key: any) =>
                handleSelectionItem(key, prestamos.prestamos)
              }
              color="primary"
              selectionMode="single"
              className={`${styles.table} ${styles["shadow-small"]}  `}
              aria-label="tabla-prestamos"
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
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                    allowsSorting={true}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                className={styles["table-body"]}
                emptyContent={t("otros.emptyContent")}
                items={items}
              >
                {(item: any) => (
                  <TableRow key={item.idPrestamo}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {modalUserInfo && (
              <ModalHistorialPagos
                onClose={closeModalUserInfo}
                historial={selectedPrestamo}
                usuario={prestamos}
              />
            )}
          </ModalBody>
          <ModalFooter className={styles["footer"]}>
            <Button
              color="danger"
              className={styles["button"]}
              onClick={closeHandler}
            >
              {t("otros.cerrar")}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalUserInfo;
