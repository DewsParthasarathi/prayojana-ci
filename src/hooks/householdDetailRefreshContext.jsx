import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

const HouseholdDetailRefreshContext = createContext({
  registerRefetch: () => {},
  refreshHouseholdDetail: async () => {},
  currentHousehold: null,
  registerCurrentHousehold: () => {},
});

export const HouseholdDetailRefreshProvider = ({ children }) => {
  const [currentHousehold, setCurrentHousehold] = useState(null);
  const refetchRef = useRef(null);

  const registerRefetch = useCallback((refetchFn) => {
    refetchRef.current = refetchFn;
  }, []);

  const registerCurrentHousehold = useCallback((household) => {
    setCurrentHousehold(household);
  }, []);

  const refreshHouseholdDetail = useCallback(async () => {
    if (typeof refetchRef.current === "function") {
      const result = await refetchRef.current();
      if (result) {
        setCurrentHousehold(result);
      }
    }
  }, []);

  return (
    <HouseholdDetailRefreshContext.Provider
      value={{
        registerRefetch,
        refreshHouseholdDetail,
        currentHousehold,
        registerCurrentHousehold,
      }}
    >
      {children}
    </HouseholdDetailRefreshContext.Provider>
  );
};

export const useHouseholdDetailRefresh = () =>
  useContext(HouseholdDetailRefreshContext);
