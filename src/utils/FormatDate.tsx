import { useTranslation } from "react-i18next";

const formatDate = (date: string) => {
  const { t } = useTranslation();
  if (!date) {
    return ""; // o cualquier otro manejo apropiado para valores nulos o indefinidos
  }

  const fecha = new Date(date);
  const dia = fecha.getDate();
  const mes = fecha.toLocaleString("en-EN", { month: "long" });
  const year = fecha.getFullYear();
  const hora = fecha.getHours();
  let hora12 = hora % 12;
  if (hora12 === 0) {
    hora12 = 12;
  }

  return <span>{`${dia} ${t("completeMonth." + mes)} ${year}`} </span>;
};

export { formatDate };
