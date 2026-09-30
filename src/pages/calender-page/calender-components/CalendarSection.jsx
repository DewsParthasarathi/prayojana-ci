import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import { getDateKey } from "../../../utils/calendarUtils";

const CalendarSection = ({
  year,
  monthIndex,
  selectedDay,
  tasksByDate,
  yearRange,
  onMonthChange,
  onYearChange,
  onSelectDate,
}) => {
  const selectedDateKey = getDateKey(year, monthIndex, selectedDay);

  return (
    <div className="w-[62%] h-full  pt-[3.8rem] flex flex-col gap-[2.4rem] overflow-hidden">
      <CalendarHeader
        selectedDay={selectedDay}
        selectedMonthIndex={monthIndex}
        selectedYear={year}
        monthIndex={monthIndex}
        year={year}
        yearRange={yearRange}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
      />

      <div className="flex-1 overflow-y-auto">
        <CalendarGrid
          year={year}
          monthIndex={monthIndex}
          tasksByDate={tasksByDate}
          selectedDateKey={selectedDateKey}
          onSelectDate={onSelectDate}
        />
      </div>
    </div>
  );
};

export default CalendarSection;
