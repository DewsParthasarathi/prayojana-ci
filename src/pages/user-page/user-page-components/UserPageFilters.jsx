import CustomDropdown from "@/components/dropdown-component/CustomDropdown";
import CustomImage from "@/components/image-component/CustomImage";
// eslint-disable-next-line no-unused-vars
import React from "react";
import filterIcon from "@assets/images/logos/filter-icon.svg";
import ButtonComponent from "@/components/button-component/ButtonComponent";

// eslint-disable-next-line no-unused-vars
const UserPageFilters = ({ filters, setFilters, onApply, onReset, count }) => {
  const empIdOptions = [
    { value: "EMPID5987401", label: "EMPID5987401" },
    { value: "EMPID5987402", label: "EMPID5987402" },
    { value: "EMPID5987403", label: "EMPID5987403" },
    { value: "EMPID5987404", label: "EMPID5987404" },
  ];

  const nameOptions = [
    { value: "Parthasarathi", label: "Parthasarathi" },
    { value: "anjali", label: "Anjali" },
    { value: "durga", label: "Durga" },
    { value: "sreeleela", label: "Sreeleela" },
  ];

  const roleOptions = [
    { value: "Senior_Manager", label: "Senior Manager" },
    { value: "Manager", label: "Manager" },
    { value: "Super_Admin", label: "Super Admin" },
    { value: "Admin", label: "Admin" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "In Active" },
    { value: "Resign", label: "Resign" },
    { value: "Active", label: "Active" },
  ];

  const dropdowns = [
    {
      name: "empId",
      placeholder: "Emp ID",
      options: empIdOptions,
    },
    {
      name: "name",
      placeholder: "Name",
      options: nameOptions,
    },
    {
      name: "role",
      placeholder: "Role",
      options: roleOptions,
    },
    {
      name: "status",
      placeholder: "Status",
      options: statusOptions,
    },
  ];

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeFilter = (key) => {
    setFilters((prev) => {
      const nextFilters = {
        ...prev,
        [key]: "",
      };

      onApply(nextFilters);
      return nextFilters;
    });
  };
  return (
    <div className="flex items-center w-full justify-between pt-[5.5rem]">
      <div className="w-[15%] relative after:content-[''] after:absolute after:top-[20%] after:right-[-1.5rem] after:w-[1px] after:h-[80%] after:bg-[#00000030] ">
        <h1 className="text-[3rem] font-semibold text-(--black)">User Data</h1>
        <p className="text-[1.6rem] text-[#959595]">Showing {count} User Data...</p>
      </div>
      <div className="flex gap-[3.6rem] w-[80%] flex-col">
        <div className="flex gap-[3.6rem] items-center">
          <div className="flex gap-[1.2rem] items-center">
            <div className="">
              <CustomImage src={filterIcon} alt="Filter" />
            </div>
            <h2 className="font-semibold text-[2.8rem]">Filters</h2>
          </div>
          {dropdowns.map((dropdown) => (
            <CustomDropdown
              key={dropdown.name}
              name={dropdown.name}
              value={filters[dropdown.name]}
              options={dropdown.options}
              placeholder={dropdown.placeholder}
              onChange={handleDropdownChange}
              className="flex-1 text-[15rem] text-liteGray"
              selectClassName="text-[14px] text-liteGray"
            />
          ))}
          <div className="">
            <ButtonComponent
              onClick={() => onApply(filters)}
              className="border-none cursor-pointer bg-[#006BBF] text-white py-[0.9rem] px-[3.5rem] rounded-[9px] flex-1 text-[1.5rem]"
            >
              Search Filters
            </ButtonComponent>
          </div>
        </div>

        <div className="w-full flex flex-wrap gap-[1.4rem]">
          {Object.entries(filters)
            // eslint-disable-next-line no-unused-vars
            .filter(([_, value]) => value !== "")
            .map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-[1.4rem] bg-chipBg border border-[var(--color-chipBorder)] pl-[1.5rem] pr-[1rem] py-[0.7rem] rounded-full text-[13px]"
              >
                {value}

                <button onClick={() => removeFilter(key)} className="font-bold">
                  ×
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserPageFilters;
