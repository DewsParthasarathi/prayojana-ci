import CareBuddyAvatar from "./CareBuddyAvatar";
import nonActiveDateImage from "@assets/images/clender-images/non-active-date.png";
const MAX_VISIBLE_AVATARS = 3;

const CalendarDateCell = ({ day, inCurrentMonth, isSelected, buddies = [], onSelect }) => {
  const visibleBuddies = buddies.slice(0, MAX_VISIBLE_AVATARS);
  const overflowCount = buddies.length - visibleBuddies.length;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!inCurrentMonth}
      className={`group relative w-full h-full min-h-[8rem] flex flex-col items-start justify-start gap-[0.8rem] px-[1rem] py-[1rem] border-b border-r border-[#EDEDED] transition-all duration-300 ease-out
        ${inCurrentMonth ? "cursor-pointer" : "cursor-default"}
        ${
          inCurrentMonth
            ? "hover:bg-[#EAF4FF] hover:shadow-[0_0.4rem_1.2rem_rgba(0,107,191,0.12)] hover:-translate-y-[0.2rem] hover:z-10"
            : ""
        }
        ${isSelected ? "bg-[#EAF4FF]" : "bg-white"}
      `}
    >
      {!inCurrentMonth && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${nonActiveDateImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      <span
        className={`relative z-[1] w-[3rem] h-[3rem] flex items-center justify-center rounded-full text-[1.5rem] font-semibold transition-all duration-300
          ${isSelected ? "bg-[#006BBF] text-white" : inCurrentMonth ? "text-[#1B1A1F]" : "text-[#BDBDBD]"}
          ${!isSelected && inCurrentMonth ? "group-hover:bg-white group-hover:shadow-sm" : ""}
        `}
      >
        {day}
      </span>

      {visibleBuddies.length > 0 && (
        <div className="relative z-[1] flex items-center">
          {visibleBuddies.map((name, index) => (
            <CareBuddyAvatar
              key={name}
              name={name}
              size="2.6rem"
              ringed
              className={index > 0 ? "-ml-[0.8rem]" : ""}
            />
          ))}
          {overflowCount > 0 && (
            <div className="-ml-[0.8rem] w-[2.6rem] h-[2.6rem] rounded-full bg-[#006BBF] ring-2 ring-white flex items-center justify-center text-white text-[1.1rem] font-semibold">
              +{overflowCount}
            </div>
          )}
        </div>
      )}
    </button>
  );
};

export default CalendarDateCell;
