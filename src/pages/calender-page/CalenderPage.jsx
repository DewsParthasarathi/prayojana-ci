import { useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/ConfirmContext.jsx";
import CalendarSection from "./calender-components/CalendarSection";
import TabsPanel from "./calender-components/TabsPanel";
import { buildCalendarState, buildTimeRange } from "../../utils/calendarUtils";

const buildGroups = (map, { nameField, seedPrefix }) => {
  const groups = Array.from(map.entries()).map(([name, items]) => ({
    name,
    count: items.length,
    items: items.map((item, index) => ({
      id: `${seedPrefix}-${name}-${item.__householdId}-${item.s_no}-${index}`,
      title: item[nameField],
      timeRange: buildTimeRange(item.time, `${seedPrefix}-${item.s_no}-${item[nameField]}`),
    })),
  }));

  return groups.sort((a, b) => b.count - a.count);
};

const CalenderPage = () => {
  const { data, isLoading, error } = useFetch("http://localhost:4001/houseHoldData");
  const { showToast } = useToast();
  const confirm = useConfirm();

  const [removedIds, setRemovedIds] = useState(() => new Set());
  const [override, setOverride] = useState(null);

  const calendarState = useMemo(() => buildCalendarState(data), [data]);
  const {
    tasksByDate,
    careBuddyTaskMap,
    careBuddyInteractionMap,
    initialYear,
    initialMonthIndex,
    initialDay,
  } = calendarState;

  const year = override?.year ?? initialYear;
  const monthIndex = override?.monthIndex ?? initialMonthIndex;
  const selectedDay = override?.day ?? initialDay;

  const yearRange = useMemo(() => {
    const years = new Set([initialYear]);
    for (let offset = -2; offset <= 3; offset += 1) years.add(initialYear + offset);
    return Array.from(years).sort((a, b) => a - b);
  }, [initialYear]);

  const taskGroups = useMemo(() => {
    const groups = buildGroups(careBuddyTaskMap, { nameField: "task_name", seedPrefix: "task" });
    return groups
      .map((group) => ({ ...group, items: group.items.filter((item) => !removedIds.has(item.id)) }))
      .map((group) => ({ ...group, count: group.items.length }));
  }, [careBuddyTaskMap, removedIds]);

  const interactionGroups = useMemo(() => {
    const groups = buildGroups(careBuddyInteractionMap, {
      nameField: "interaction",
      seedPrefix: "interaction",
    });
    return groups
      .map((group) => ({ ...group, items: group.items.filter((item) => !removedIds.has(item.id)) }))
      .map((group) => ({ ...group, count: group.items.length }));
  }, [careBuddyInteractionMap, removedIds]);

  const handleMonthChange = (newMonthIndex) => {
    setOverride({ year, monthIndex: newMonthIndex, day: 1 });
  };

  const handleYearChange = (newYear) => {
    setOverride({ year: newYear, monthIndex, day: 1 });
  };

  const handleSelectDate = (day) => {
    setOverride({ year, monthIndex, day });
  };

  const handleEditItem = (tab, buddyName, item) => {
    showToast?.({
      variant: "success",
      description: `Editing "${item.title}" for ${buddyName}.`,
    });
  };

  const handleDeleteItem = async (tab, buddyName, item) => {
    const ok = await confirm({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this item? This action cannot be undone.",
    });
    if (!ok) return;

    setRemovedIds((prev) => new Set(prev).add(item.id));
    showToast?.({
      variant: "success",
      description: `Removed "${item.title}" from ${buddyName}'s ${tab === "tasks" ? "tasks" : "interactions"}.`,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-[1.6rem] text-[#8A8A8A]">Loading calendar…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-[1.6rem] text-[#FA0F19]">Failed to load calendar data.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex gap-[2%] justify-between">
      <CalendarSection
        year={year}
        monthIndex={monthIndex}
        selectedDay={selectedDay}
        tasksByDate={tasksByDate}
        yearRange={yearRange}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onSelectDate={handleSelectDate}
      />

      <TabsPanel
        taskGroups={taskGroups}
        interactionGroups={interactionGroups}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default CalenderPage;
