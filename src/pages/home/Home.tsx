import { useEffect, useContext, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";
import BookImage from "./BookImage";
import { SearchContext } from "../../context/SearchContext";
import { FilterContext } from "../../context/BookFilterContext";
import styles from "./Home.module.css";
import { useGetData } from "./getData";

const Home = () => {
  const { data } = useGetData();
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const { filter, setFilter } = useContext(FilterContext);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let filteredBooks = data;

    if (searchTerm) {
      filteredBooks = data.filter(
        (book: any) =>
          (book.autor &&
            book.autor.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (book.titulo &&
            book.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else if (filter.type !== "" && filter.value !== "") {
      const lowerCaseFilterType = filter.type.toLowerCase();
      filteredBooks = data.filter((book: any) => {
        const bookProperty = book[lowerCaseFilterType];
        return (
          bookProperty &&
          typeof bookProperty === "string" &&
          bookProperty.toLowerCase().includes(filter.value.toLowerCase())
        );
      });
    } else {
      filteredBooks = data;
    }

    setFilteredData(filteredBooks);
  }, [data, filter, searchTerm]);

  useEffect(() => {
    //si se hace una busqueda se limpia el filtro
    if (searchTerm) {
      setFilter("", "");
    }
  }, [searchTerm]);

  useEffect(() => {
    //si se hace un filtro se limpia la busqueda
    if (filter.type !== "" && filter.value !== "") {
      setSearchTerm("");
    }
  }, [filter]);

  const quantityColor = (quantity: any) => {
    if (quantity > 2) {
      return "green";
    } else if (quantity > 0) {
      return "orange";
    } else {
      return "red";
    }
  };

  return (
    <div className={styles["main"]}>
      <ScrollShadow
        size={10}
        className={styles["card-container"]}
        style={{ overflowY: "auto", maxHeight: "92vh" }}
      >
        {filteredData.map((book: any) => (
          <Card key={book.idLibro} className={styles["card"]}>
            <div className="text-2xl font-bold text-secundary">
              {book.titulo.charAt(0).toUpperCase() + book.titulo.slice(1)}
            </div>

            <div className={styles["layout-card"]}>
              <div className={styles["center"]}>
                <div className={styles["image"]}>
                  <BookImage idLibro={book.idLibro} />
                </div>
              </div>

              <div className={styles["info"]}>
                <CardBody>
                  <p className="text-small text-default-500">Autor</p>
                  <p>
                    {book.autor.charAt(0).toUpperCase() + book.autor.slice(1)}
                  </p>
                  <p className="text-small text-default-500">Género</p>
                  <p>
                    {book.genero.charAt(0).toUpperCase() + book.genero.slice(1)}
                  </p>
                  <p className="text-small text-default-500">Editorial</p>
                  <p>
                    {book.editorial.charAt(0).toUpperCase() +
                      book.editorial.slice(1)}
                  </p>
                  <p className="text-small text-default-500">
                    Cantidad Disponible
                  </p>
                  <p style={{ color: quantityColor(book.cantidad) }}>
                    {book.cantidad}
                  </p>
                </CardBody>
              </div>
            </div>
          </Card>
        ))}
      </ScrollShadow>
    </div>
  );
};

export default Home;
