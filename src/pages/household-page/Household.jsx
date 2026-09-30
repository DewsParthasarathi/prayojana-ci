import { useLocation } from "react-router-dom";

import HouseholdSubView from "./HouseholdSubView";
import HouseholdList from "./HouseholdList";
import { getHouseholdViewConfig } from "@/config/householdViewConfig";

const Household = () => {
  const location = useLocation();
  const viewType = location.state?.viewType || null;
  const household = location.state?.household || null;

  if (viewType && getHouseholdViewConfig(viewType) && household) {
    return <HouseholdSubView viewType={viewType} household={household} />;
  }

  return <HouseholdList />;
};

export default Household;
