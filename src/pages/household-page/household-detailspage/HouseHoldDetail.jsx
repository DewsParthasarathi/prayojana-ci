import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Details from "./details-component/PlanContactDetails";
import CustomerDetails from "./details-component/CustomerDetails";
import { useHouseholdDetailRefresh } from "@/hooks/householdDetailRefreshContext.jsx";
// eslint-disable-next-line no-unused-vars
import useFetch from "@/hooks/useFetch";
// eslint-disable-next-line no-unused-vars
import ReusableSidebar from "@/components/sidebar-drawer/ReusableSidebar";

const HouseHoldDetail = () => {
  const location = useLocation();
  const { householdId } = useParams();
  const [household, setHousehold] = useState(location.state?.household || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { registerRefetch, registerCurrentHousehold } = useHouseholdDetailRefresh();

  const fetchHousehold = useCallback(async () => {
    if (!householdId) {
      setError("Invalid household ID.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:4001/houseHoldData/${householdId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch household details.");
      }

      const result = await response.json();
      setHousehold(result);
      registerCurrentHousehold(result);
      return result;
    } catch (err) {
      setError(err.message || "Unable to load household details.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [householdId, registerCurrentHousehold]);

  useEffect(() => {
    // eslint-disable-next-line renders
    fetchHousehold();
  }, [fetchHousehold]);

  useEffect(() => {
    if (household) {
      registerCurrentHousehold(household);
    }
  }, [household, registerCurrentHousehold]);

  useEffect(() => {
    registerRefetch(fetchHousehold);
  }, [fetchHousehold, registerRefetch]);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (loading || !household) {
    return <div className="text-[2rem]">Loading household details...</div>;
  }

  return (
    <>
      <div className="w-full  h-auto">
        <div className="w-full h-auto ">
          <div className="heading-container pt-[3.5rem] pb-[3.5rem]">
            <h2 className="text-[3rem] text-(--black) font-semibold">{household.household_name}</h2>
            <p className="text-(--color-label-gray) text-[1.8rem]">
              House Hold {">"} {household.household_name}
            </p>
          </div>
          <div className="details-container">
            <Details household={household} />
          </div>
          <div className="customer-details overflow-y-auto mt-[4.7rem] pr-[3rem]">
            <CustomerDetails household={household} />
          </div>
        </div>
      </div>
      {/* <div className="heading-container pt-[3.5rem] pb-[3.5rem]">
        <h2 className="text-[3rem] font-semibold">{household.household_name}</h2>
        <p className="text-label-gray text-[1.8rem]">
          House Hold {">"} {household.household_name}
        </p>
      </div>
      <div className="details-container">
        <Details household={household} />
      </div>
      <div className="customer-details overflow-y-auto mt-[4.7rem] pr-[3rem]">
        <CustomerDetails household={household} />
      </div> */}
    </>
  );
};

export default HouseHoldDetail;
