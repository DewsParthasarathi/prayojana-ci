import CustomDropdown from "@/components/dropdown-component/CustomDropdown";
import ButtonComponent from "@/components/button-component/ButtonComponent";

const HouseholdViewFilters = ({
  title,
  subtitle,
  prid,
  filterDefs = [],
  filters,
  setFilters,
  onApply,
}) => {
  const handleChange = (name) => (event) =>
    setFilters((prev) => ({ ...prev, [name]: event.target.value }));

  return (
    <div className="flex items-start justify-between w-full pt-[5.5rem] pb-[3.7rem] gap-[17.7rem]">
      <div className="shrink-0 pr-[3rem] relative after:absolute after:content-[''] after:top-0 after:right-[-25%] after:w-[1px] after:h-[80%] my-auto after:bg-[#E0E0E0]">
        <h2 className="text-[3rem] font-semibold text-(--black)">{title}</h2>
        <p className="text-[1.6rem] text-gray-500">
          {subtitle}
          {prid ? <span className="text-gray-400"> | {prid}</span> : null}
        </p>
      </div>

      {filterDefs.length > 0 && (
        <div className="flex-1 flex items-center justify-end gap-[3.7rem]">
          {filterDefs.map((def) => (
            <CustomDropdown
              key={def.name}
              name={def.name}
              value={filters[def.name] || ""}
              options={def.options}
              placeholder={def.placeholder}
              onChange={handleChange(def.name)}
              className="flex-1 text-liteGray"
              selectClassName="text-[1.8rem] text-liteGray py-[0.8rem]"
            />
          ))}
          <ButtonComponent
            className="border-none cursor-pointer bg-[#006BBF] text-white py-[0.9rem] px-[3.5rem] rounded-[9px] text-[1.5rem]"
            onClick={() => onApply?.(filters)}
          >
            Apply
          </ButtonComponent>
        </div>
      )}
    </div>
  );
};

export default HouseholdViewFilters;
