import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import HouseHoldFilters from "./HouseHoldFilters";
import CustomTable from "@/components/table-component/CustomTable";
import householdJson from "@/data/houseHoldData.json";

import anjali from "@assets/images/profile-images/anjali.png";
import durga from "@assets/images/profile-images/durga.png";
import sreeleela from "@assets/images/profile-images/sreeleela.png";
import editIcon from "@assets/images/logos/edit.png";
import deleteIcon from "@assets/images/logos/delete.png";
import moreIcon from "@assets/images/logos/more.png";
import useFetch from "@/hooks/useFetch";
import { useGlobalSearch } from "@/hooks/globalSearchContext.jsx";
import { useConfirm } from "@/hooks/ConfirmContext.jsx";
import { useToast } from "@/hooks/useToast";

const FALLBACK_HOUSEHOLDS = householdJson.houseHoldData || [];

const SEARCH_FIELDS = ["prid_no", "household_name", "status", "planStatus"];

const HouseholdList = () => {
  const { data } = useFetch("http://localhost:4001/houseHoldData");
  const navigate = useNavigate();
  const { searchTerm } = useGlobalSearch();
  const confirm = useConfirm();
  const { showToast } = useToast();
  const { del } = useFetch();

  const initialFilters = {
    status: "",
    validTill: "",
    planType: "",
    careBuddies: "",
    city: "",
    captain: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  const [records, setRecords] = useState(FALLBACK_HOUSEHOLDS);
  const [filteredUsers, setFilteredUsers] = useState(FALLBACK_HOUSEHOLDS);
  const [syncedData, setSyncedData] = useState(null);

  if (Array.isArray(data) && data.length && data !== syncedData) {
    setSyncedData(data);
    setRecords(data);
    setFilteredUsers(data);
  }

  const handleApplyFilters = (nextFilters = filters) => {
    let result = [...records];
    if (nextFilters.status)
      result = result.filter(
        (item) => item.status?.toLowerCase() === nextFilters.status.toLowerCase(),
      );
    if (nextFilters.planType)
      result = result.filter(
        (item) => item.plan_type?.toLowerCase() === nextFilters.planType.toLowerCase(),
      );
    if (nextFilters.validTill)
      result = result.filter(
        (item) => item.valid_till?.toLowerCase() === nextFilters.validTill.toLowerCase(),
      );
    if (nextFilters.city)
      result = result.filter((item) => item.city?.toLowerCase() === nextFilters.city.toLowerCase());
    if (nextFilters.captain)
      result = result.filter(
        (item) => item.captain?.toLowerCase() === nextFilters.captain.toLowerCase(),
      );
    if (nextFilters.careBuddies)
      result = result.filter((item) =>
        item.care_buddies?.some(
          (buddy) => buddy.name.toLowerCase() === nextFilters.careBuddies.toLowerCase(),
        ),
      );
    setFilteredUsers(result);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setFilteredUsers(records);
  };

  const handleDeleteClick = async (row) => {
    const ok = await confirm({
      title: "Confirm Delete",
      message: `Are you sure you want to delete "${row.household_name || "this household"}"? This action cannot be undone.`,
    });
    if (!ok) return;

    try {
      await del(`http://localhost:4001/houseHoldData/${row.id}`);
      setRecords((prev) => prev.filter((item) => item.id !== row.id));
      setFilteredUsers((prev) => prev.filter((item) => item.id !== row.id));
      showToast({ variant: "success", description: "Household deleted successfully." });
    } catch (err) {
      showToast({
        variant: "error",
        description: err.message || "Failed to delete household.",
      });
    }
  };

  const searchedUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return filteredUsers;

    return filteredUsers.filter((item) =>
      SEARCH_FIELDS.some((field) =>
        String(item?.[field] || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [filteredUsers, searchTerm]);

  const handleHouseholdClick = (row) => {
    navigate(`/details/${row.id}`, { state: { household: row } });
  };

  const HEADER = "font-semibold bg-[#0000001A] text-gray-700 text-[1.8rem] py-[2.3rem]";

  const columns = [
    {
      header: "PRID No",
      accessor: "prid_no",
      sortable: true,
      sortType: "text",
      headerClassName: HEADER,
    },
    {
      header: "Household Name",
      sortable: true,
      sortType: "text",
      headerClassName: HEADER,
      render: (row) => (
        <span
          onClick={() => handleHouseholdClick(row)}
          className="cursor-pointer text-[#006BBF] hover:underline"
        >
          {row.household_name}
        </span>
      ),
    },
    {
      header: "Plan Type",
      accessor: "plan_type",
      sortable: true,
      sortType: "text",
      headerClassName: HEADER,
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      sortType: "text",
      headerClassName: HEADER,
    },
    {
      header: "Valid Till",
      accessor: "valid_till",
      sortable: true,
      sortType: "text",
      headerClassName: HEADER,
    },
    {
      header: "Care Buddies",
      headerClassName: HEADER,
      sortable: true,
      sortType: "text",
      render: (row) => (
        <div className="flex">
          {row.care_buddies?.map((member, index) => (
            <div key={index} className="w-[30px] h-[30px] rounded-full overflow-hidden">
              <img
                src={
                  member.name === "Anjali" ? anjali : member.name === "Durga" ? durga : sreeleela
                }
                alt={member.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      header: "Action",
      headerClassName: `${HEADER} !text-center`,
      render: (row) => (
        <div className="flex  gap-[3rem] justify-center">
          <button className="w-[30px] h-[30px]">
            <img src={editIcon} alt="edit" />
          </button>
          <button
            type="button"
            className="w-[30px] h-[30px]"
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteClick(row);
            }}
            aria-label="delete"
          >
            <img src={deleteIcon} alt="delete" />
          </button>
          <button className="w-[30px] h-[30px]">
            <img src={moreIcon} alt="more" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full  h-full flex flex-col">
      <div className="w-full h-full flex flex-col">
        <HouseHoldFilters
          filters={filters}
          setFilters={setFilters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          count={searchedUsers.length}
        />
        <div className="flex-1 overflow-y-auto pr-[1rem]">
          <CustomTable columns={columns} data={searchedUsers} keyField="id" />
        </div>
      </div>
    </div>
  );
};

export default HouseholdList;
