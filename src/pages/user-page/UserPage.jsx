import CustomTable from "@/components/table-component/CustomTable";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useState } from "react";
import UserPageFilters from "./user-page-components/UserPageFilters";
import { useGlobalSearch } from "@/hooks/globalSearchContext";
import editIcon from "@assets/images/logos/edit.png";
import deleteIcon from "@assets/images/logos/delete.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAdmins } from "@/store/slices/adminsSlice";
import { ROUTES } from "@/routes/routes";
import CustomImage from "@/components/image-component/CustomImage";
import addIcon from "@assets/images/household-images/add-icon.png";

const SEARCH_FIELDS = ["empId", "name", "role", "email", "telephone", "status"];

const UserPage = () => {
  const users = useSelector(selectAdmins);
  const { searchTerm } = useGlobalSearch();
  const navigate = useNavigate();
  const initialFilters = {
    empId: "",
    name: "",
    role: "",
    status: "",
    city: "",
    captain: "",
  };
  const [filters, setFilters] = useState(initialFilters);
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleApplyFilters = (nextFilters = filters) => {
    let result = [...users];
    if (nextFilters.empId)
      result = result.filter(
        (item) => item.empId?.toLowerCase() === nextFilters.empId.toLowerCase(),
      );
    if (nextFilters.role)
      result = result.filter((item) => item.role?.toLowerCase() === nextFilters.role.toLowerCase());
    if (nextFilters.name)
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(nextFilters.name.toLowerCase()),
      );
    if (nextFilters.status)
      result = result.filter(
        (item) => item.status?.toLowerCase() === nextFilters.status.toLowerCase(),
      );
    setFilteredUsers(result);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setFilteredUsers(users);
  };

  const handleUserClick = (row) => {
    navigate(`/userdata/${row.id}`, { state: { users: row } });
  };

  const searchedUsers = useMemo(() => {
    const query = (searchTerm || "").trim().toLowerCase();
    if (!query) return filteredUsers;
    return filteredUsers.filter((item) =>
      SEARCH_FIELDS.some((field) =>
        String(item?.[field] || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [filteredUsers, searchTerm]);

  const HEADER = "font-semibold bg-[#0000001A] text-gray-700 text-[1.8rem] py-[2.3rem] ";

  const columns = [
    {
      header: "Emp ID",
      accessor: "empId",
      sortable: true,
      sortType: "text",
      headerClassName: HEADER,
    },
    {
      header: "Name",
      sortable: true,
      sortType: "text",

      headerClassName: HEADER,
      render: (row) => (
        <span
          onClick={() => handleUserClick(row)}
          className="cursor-pointer text-[#006BBF] hover:underline"
        >
          {row.name}
        </span>
      ),
    },
    { header: "Role", accessor: "role", sortable: true, sortType: "text", headerClassName: HEADER },
    { header: "Telephone No", accessor: "telephone", headerClassName: HEADER },
    { header: "Email ID", accessor: "email", headerClassName: HEADER },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      sortType: "text",
      headerClassName: HEADER,
    },
    {
      header: "Action",
      headerClassName: `${HEADER} !text-center`,
      render: (row) => (
        <div className="flex gap-[3rem] justify-center">
          <button
            className="w-[32px] h-[32px]"
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.USERDATAEDITFORM, { state: { userId: row.id, users: row } });
            }}
          >
            <img src={editIcon} alt="edit" />
          </button>
          <button className="w-[32px] h-[32px]">
            <img src={deleteIcon} alt="delete" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <UserPageFilters
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        count={searchedUsers.length}
      />
      <div className="pt-[5.6rem] bg-transparent">
        <CustomTable columns={columns} data={searchedUsers} keyField="id" />
      </div>

      <button
        type="button"
        aria-label="Add User"
        onClick={() => navigate(ROUTES.USERDATAFORM)}
        className="fixed bottom-[6rem] right-[6rem] z-40 w-[6.4rem] h-[6.4rem] rounded-full text-white text-[3.2rem] leading-none flex items-center justify-center  hover:bg-[#0F6FBE] transition-colors"
      >
        <CustomImage src={addIcon} alt="add users" />
      </button>
    </>
  );
};

export default UserPage;
