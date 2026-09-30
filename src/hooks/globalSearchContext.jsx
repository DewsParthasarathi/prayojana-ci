import { createContext, useContext, useMemo, useState } from "react";

const GlobalSearchContext = createContext({
  searchTerm: "",
  setSearchTerm: () => {},
});

export const GlobalSearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const value = useMemo(() => ({ searchTerm, setSearchTerm }), [searchTerm]);

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
    </GlobalSearchContext.Provider>
  );
};

export const useGlobalSearch = () => useContext(GlobalSearchContext);
