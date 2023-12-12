import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  Table,
  Pagination,
  TableCell,
} from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import styles from "./ModalHistorialPrestamos.module.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface InfoUserProps {
  onClose: () => void;
  historial: any;
  usuario: any;
}

const ModalUserInfo: React.FC<InfoUserProps> = ({ onClose, historial }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  type HistorialPagos = (typeof historial)[0];
  const [page, setPage] = React.useState(1);
  const [historialPagos, setHistorialPagos] = useState<any[]>([]);

  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending" | undefined;
  }>({
    column: "",
    direction: undefined,
  });

  useEffect(() => {
    if (historial !== null) {
      setHistorialPagos(historial.historialPagos);
    }
  }, [historial]);

  const closeHandler = () => {
    setVisible(false);
    onClose();
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
      const cellValue = historialPagos[columnKey as keyof HistorialPagos];
      //obtener la token de las cookies
      const token = Cookies.get("accessToken");
      if (!token) {
        return;
      }
      //decodificar el token
      const decodedToken = jwtDecode(token!) as any;
      //setear si el usuario esta activo o no
      let isActive = JSON.parse(decodedToken.isActive);
      switch (columnKey) {
        case "fechaPago":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{formatDate(cellValue)}</p>
            </div>
          );
        case "montoPagado":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {(Number(cellValue), isActive)}
              </p>
            </div>
          );
        case "montoRestante":
          return (
            <div className="capitalize">{(Number(cellValue), isActive)}</div>
          );
        case "intereses":
          return <div className="capitalize">{cellValue}%</div>;
      }
    },
    []
  );

  const columns = [
    //nombres y apellidos
    { name: t("tables.fechayHora"), uid: "fechaPago" },
    { name: t("tables.cantidadPagada"), uid: "montoPagado" },
    { name: t("tables.cantidadRestante"), uid: "montoRestante" },
    { name: t("tables.intereses"), uid: "intereses" },
    //{ name: t("tables.actions"), uid: "actions" },
  ];

  const sortedItems = useMemo(() => {
    if (!historialPagos) {
      return historial;
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

  return (
    <Modal
      size="3xl"
      isOpen={visible}
      aria-labelledby="modal-signup"
      onClose={closeHandler}
      backdrop="blur"
      isDismissable={false}
      scrollBehavior="inside"
      placement="auto"
    >
      <ModalContent>
        <>
          <ModalHeader className={styles["header"]}>
            {t("otros.infoPagos")}
          </ModalHeader>
          <ModalBody>
            <Table
              color="primary"
              selectionMode="single"
              className={styles["table"]}
              aria-label="tabla-usuarios"
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
                  <TableRow key={item.idHistorialPago}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
