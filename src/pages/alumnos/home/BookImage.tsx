import useGetBookImage from "../../../hooks/useGetBookImage";
import { Image } from "@nextui-org/react";
import styles from "./Home.module.css";
const UserImage = ({ idLibro }: { idLibro: Number }) => {
  const imagenPerfil = useGetBookImage(idLibro);
  return <Image className={styles["img"]} src={imagenPerfil}></Image>;
};

export default UserImage;
