import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { MONTH_NAMES } from "../../../utils/calendarUtils";

const Pill = ({ label, options, activeValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-[1rem] px-[2.8rem] py-[1rem] rounded-[8px] border border-[#E0E0E0] bg-white text-[1.5rem] font-medium text-[#1B1A1F] transition-colors duration-200 hover:border-[#006BBF]"
      >
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-[0.8rem] max-h-[24rem] overflow-y-auto w-[14rem] rounded-[1.2rem] bg-white shadow-[0_0.6rem_2rem_rgba(0,0,0,0.12)] border border-[#EDEDED] z-20 py-[0.6rem]">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-[1.6rem] py-[0.9rem] text-[1.4rem] transition-colors duration-150 hover:bg-[#EAF4FF]
                ${option.value === activeValue ? "text-[#006BBF] font-semibold" : "text-[#333333]"}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CalendarHeader = ({
  selectedDay,
  selectedMonthIndex,
  selectedYear,
  monthIndex,
  year,
  yearRange,
  onMonthChange,
  onYearChange,
}) => {
  const monthOptions = MONTH_NAMES.map((name, index) => ({ value: index, label: name }));
  const yearOptions = yearRange.map((y) => ({ value: y, label: String(y) }));

  return (
    <div className="flex items-start justify-between flex-wrap gap-[1.6rem]">
      <div>
        <h2 className="text-[2rem] font-semibold text-[#1B1A1F]">Calendar</h2>
        <p className="mt-[0.4rem] text-[2.6rem] font-bold text-[#1B1A1F]">
          {selectedDay} {MONTH_NAMES[selectedMonthIndex]} {selectedYear}
        </p>
      </div>

      <div className="flex items-center gap-[1.2rem]">
        <Pill
          label={MONTH_NAMES[monthIndex]}
          options={monthOptions}
          activeValue={monthIndex}
          onSelect={onMonthChange}
        />
        <Pill
          label={String(year)}
          options={yearOptions}
          activeValue={year}
          onSelect={onYearChange}
        />
      </div>
    </div>
  );
};

export default CalendarHeader;
