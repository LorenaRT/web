import React, { createContext, useState } from "react";

type FilterContextType = {
  filter: {
    type: string;
    value: string;
  };
  setFilter: (type: string, value: string) => void;
};

export const FilterContext = createContext<FilterContextType>({
  filter: {
    type: "",
    value: "",
  },
  setFilter: () => {},
});

type FilterContextProviderProps = {
  children: React.ReactNode;
};

export const FilterContextProvider: React.FC<FilterContextProviderProps> = ({
  children,
}) => {
  const [filter, setFilter] = useState({ type: "", value: "" });

  const handleSetFilter = (type: string, value: string) => {
    setFilter({ type, value });
  };

  return (
    <FilterContext.Provider value={{ filter, setFilter: handleSetFilter }}>
      {children}
    </FilterContext.Provider>
  );
};
