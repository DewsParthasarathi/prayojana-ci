import CalendarDateCell from "./CalendarDateCell";
import { WEEKDAYS, buildCalendarGrid, getDateKey } from "../../../utils/calendarUtils";

const CalendarGrid = ({ year, monthIndex, tasksByDate, selectedDateKey, onSelectDate }) => {
  const cells = buildCalendarGrid(year, monthIndex);

  return (
    <div className="w-full h-full rounded-[7.6px] overflow-hidden border-l border-t border-[#EDEDED]">
      <div className="grid grid-cols-7 ">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="px-[1rem] py-[1.2rem] text-[1.3rem] font-medium text-[#666666] border-b border-r border-[#EDEDED] bg-[#FAFAFA]"
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 h-[100%]">
        {cells.map((cell) => {
          const dateKey = getDateKey(cell.year, cell.monthIndex, cell.day);
          const dayData = tasksByDate[dateKey];

          return (
            <CalendarDateCell
              key={`${dateKey}-${cell.inCurrentMonth}`}
              day={cell.day}
              inCurrentMonth={cell.inCurrentMonth}
              isSelected={cell.inCurrentMonth && dateKey === selectedDateKey}
              buddies={dayData?.buddies || []}
              onSelect={() => cell.inCurrentMonth && onSelectDate(cell.day)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
