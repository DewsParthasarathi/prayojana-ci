import ButtonComponent from "@/components/button-component/ButtonComponent";
import CustomDropdown from "@/components/dropdown-component/CustomDropdown";

const HouseHoldFilters = ({ filters, setFilters, onApply, onReset, count }) => {
  const statusOptions = [
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
    { value: "inProgress", label: "In Progress" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const validTillOptions = [
    { value: "7days", label: "Next 7 Days" },
    { value: "30days", label: "Next 30 Days" },
    { value: "expired", label: "Expired" },
  ];

  const planOptions = [
    { value: "single", label: "Single" },
    { value: "basic", label: "Basic" },
    { value: "essential", label: "Essential" },
  ];

  const careBuddiesOptions = [
    { value: "sreeleela", label: "Sreeleela" },
    { value: "anjali", label: "Anjali" },
    { value: "durga", label: "Durga" },
  ];

  const cityOptions = [
    { value: "chennai", label: "Chennai" },
    { value: "bangalore", label: "Bangalore" },
    { value: "mumbai", label: "Mumbai" },
  ];

  const captainOptions = [
    { value: "priyaSen", label: "Priya Sen" },
    { value: "amitVerma", label: "Amit Verma" },
    { value: "rahulBose", label: "Rahul Bose" },
    { value: "vikramJoshi", label: "Vikram Joshi" },
    { value: "nehaGupta", label: "Neha Gupta" },
    { value: "arjunMehta", label: "Arjun Mehta" },
  ];

  const dropdowns = [
    {
      name: "status",
      placeholder: "Status",
      options: statusOptions,
    },
    {
      name: "validTill",
      placeholder: "Valid Till",
      options: validTillOptions,
    },
    {
      name: "planType",
      placeholder: "Plan Type",
      options: planOptions,
    },
    {
      name: "careBuddies",
      placeholder: "Care Buddy",
      options: careBuddiesOptions,
    },
    {
      name: "city",
      placeholder: "City",
      options: cityOptions,
    },
    {
      name: "captain",
      placeholder: "Captain",
      options: captainOptions,
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
    <div className="flex pt-[5.5rem] pb-[3.7rem] items-center justify-between w-full pl-4  pt-3 rounded-lg  items-start">
      {/* Left */}
      <div className="w-[13%] mb-auto">
        <h2 className="text-[3rem] font-semibold text-[var(--black)]">Household</h2>
        <p className="text-[1.6rem] text-gray-500 dark:text-gray-400">
          Showing {count} Households...
        </p>
      </div>

      {/* Filters */}
      <div className="w-[63%] flex flex-col gap-2">
        <div className="flex  items-center gap-[2rem] ">
          {dropdowns.map((dropdown) => (
            <CustomDropdown
              key={dropdown.name}
              name={dropdown.name}
              value={filters[dropdown.name]}
              options={dropdown.options}
              placeholder={dropdown.placeholder}
              onChange={handleDropdownChange}
              className="flex-1 text-[12rem] text-[var(--color-liteGray)]"
              selectClassName="text-[12px] text-[var(--color-liteGray)]"
            />
          ))}
        </div>

        <div className="w-full flex flex-wrap gap-[1.4rem]">
          {Object.entries(filters)
            // eslint-disable-next-line no-unused-vars
            .filter(([_, value]) => value !== "")
            .map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-[1.4rem] bg-chipBg border border-[var(--color-chipBorder)] pl-[1.5rem] pr-[1rem] mt-[2.6rem] py-[0.7rem] rounded-full text-[13px]"
              >
                {value}

                <button onClick={() => removeFilter(key)} className="font-bold">
                  ×
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-[20%] flex items-center justify-end gap-2 ">
        <ButtonComponent
          className="border-none cursor-pointer bg-[#006BBF] text-white py-[0.9rem] px-[3.5rem] rounded-[9px] flex-1 text-[1.5rem] max-md:text-[12px]"
          onClick={() => onApply(filters)}
        >
          Apply
        </ButtonComponent>

        <ButtonComponent
          className="border-none py-[9px] px-[9%] cursor-pointer bg-transparent py-[0.9rem] px-[3.5rem] flex-1 text-[1.5rem] max-xl:text-[12px]"
          onClick={onReset}
        >
          <span className="border-none bg-transparent text-[#006BBF] "> Reset</span>
        </ButtonComponent>
      </div>
    </div>
  );
};

export default HouseHoldFilters;
