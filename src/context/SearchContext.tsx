import React, { createContext, useState } from "react";

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export const SearchContext = createContext<SearchContextType>({
  searchTerm: "",
  setSearchTerm: () => { },
});

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider: React.FC<SearchContextProviderProps> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};
