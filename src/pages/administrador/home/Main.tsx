import { Card, CardHeader, CardBody } from "@nextui-org/react";
import styles from "./Home.module.css";

const Main = () => {
  return (
    <div className={styles["center"]}>
      <Card>
        <CardHeader>Inicio</CardHeader>
        <CardBody>Inicio de administrador</CardBody>
      </Card>
    </div>
  );
};

export default Main;
