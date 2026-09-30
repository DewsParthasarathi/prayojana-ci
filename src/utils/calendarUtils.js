export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_ABBR_TO_INDEX = MONTH_NAMES.reduce((acc, name, index) => {
  acc[name.slice(0, 3).toLowerCase()] = index;
  return acc;
}, {});

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const parseDisplayDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.trim().split(" ");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const monthIndex = MONTH_ABBR_TO_INDEX[parts[1].toLowerCase()];
  const year = parseInt(parts[2], 10);

  if (Number.isNaN(day) || monthIndex === undefined || Number.isNaN(year)) {
    return null;
  }

  return { day, monthIndex, year, dateKey: `${year}-${monthIndex}-${day}` };
};

export const getDateKey = (year, monthIndex, day) => `${year}-${monthIndex}-${day}`;

export const getMonthKey = (year, monthIndex) => `${year}-${monthIndex}`;

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const formatMinutesToTime = (totalMinutes) => {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  let hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const meridiem = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${hours}:${String(minutes).padStart(2, "0")} ${meridiem}`;
};

const DURATION_STEPS = [30, 45, 60, 75, 90];

const seededDuration = (seedText) => {
  const text = seedText || "";
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  }
  return DURATION_STEPS[hash % DURATION_STEPS.length];
};

export const buildTimeRange = (timeStr, seedText) => {
  const startMinutes = parseTimeToMinutes(timeStr);
  const duration = seededDuration(seedText);
  const startLabel = formatMinutesToTime(startMinutes);
  const endLabel = formatMinutesToTime(startMinutes + duration);
  return `${startLabel} - ${endLabel}`;
};

export const getDaysInMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();

export const getMondayFirstWeekday = (year, monthIndex, day) => {
  const jsDay = new Date(year, monthIndex, day).getDay(); // 0 = Sunday
  return (jsDay + 6) % 7;
};

export const buildCalendarGrid = (year, monthIndex) => {
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const leadingOffset = getMondayFirstWeekday(year, monthIndex, 1);

  const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
  const prevYear = monthIndex === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

  const nextMonthIndex = monthIndex === 11 ? 0 : monthIndex + 1;
  const nextYear = monthIndex === 11 ? year + 1 : year;

  const totalCells = Math.ceil((leadingOffset + daysInMonth) / 7) * 7;
  const trailingCount = totalCells - leadingOffset - daysInMonth;

  const cells = [];

  for (let i = 0; i < leadingOffset; i += 1) {
    const day = daysInPrevMonth - leadingOffset + i + 1;
    cells.push({ day, year: prevYear, monthIndex: prevMonthIndex, inCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, year, monthIndex, inCurrentMonth: true });
  }

  for (let day = 1; day <= trailingCount; day += 1) {
    cells.push({ day, year: nextYear, monthIndex: nextMonthIndex, inCurrentMonth: false });
  }

  return cells;
};

export const buildCalendarState = (households) => {
  const list = Array.isArray(households) ? households : [];

  const tasksByDate = {};
  const monthTaskCounts = {};
  const careBuddyTaskMap = new Map();
  const careBuddyInteractionMap = new Map();
  const allBuddyNames = new Set();

  list.forEach((household) => {
    const buddies = Array.isArray(household.care_buddies) ? household.care_buddies : [];
    buddies.forEach((buddy) => buddy?.name && allBuddyNames.add(buddy.name));

    const tasks = Array.isArray(household.tasks) ? household.tasks : [];
    tasks.forEach((task) => {
      const parsed = parseDisplayDate(task.date);
      const buddyName = task.care_buddy_name;
      if (!parsed || !buddyName) return;

      allBuddyNames.add(buddyName);

      if (!tasksByDate[parsed.dateKey]) {
        tasksByDate[parsed.dateKey] = { buddies: [], items: [] };
      }
      if (!tasksByDate[parsed.dateKey].buddies.includes(buddyName)) {
        tasksByDate[parsed.dateKey].buddies.push(buddyName);
      }
      tasksByDate[parsed.dateKey].items.push(task);

      const monthKey = getMonthKey(parsed.year, parsed.monthIndex);
      monthTaskCounts[monthKey] = (monthTaskCounts[monthKey] || 0) + 1;

      if (!careBuddyTaskMap.has(buddyName)) careBuddyTaskMap.set(buddyName, []);
      careBuddyTaskMap
        .get(buddyName)
        .push({ ...task, __householdId: household.id, __dateKey: parsed.dateKey });
    });

    const interactions = Array.isArray(household.interactions) ? household.interactions : [];
    if (buddies.length > 0) {
      let cursor = 0;
      interactions.forEach((interaction) => {
        if (interaction.created_by !== "Care Buddy") return;
        const buddyName = buddies[cursor % buddies.length].name;
        cursor += 1;

        if (!careBuddyInteractionMap.has(buddyName)) careBuddyInteractionMap.set(buddyName, []);
        careBuddyInteractionMap
          .get(buddyName)
          .push({ ...interaction, __householdId: household.id });
      });
    }
  });

  let bestMonthKey = null;
  let bestCount = -1;
  Object.keys(monthTaskCounts)
    .sort((a, b) => {
      const [ay, am] = a.split("-").map(Number);
      const [by, bm] = b.split("-").map(Number);
      return ay - by || am - bm;
    })
    .forEach((monthKey) => {
      if (monthTaskCounts[monthKey] > bestCount) {
        bestCount = monthTaskCounts[monthKey];
        bestMonthKey = monthKey;
      }
    });

  let initialYear = new Date().getFullYear();
  let initialMonthIndex = new Date().getMonth();
  if (bestMonthKey) {
    const [y, m] = bestMonthKey.split("-").map(Number);
    initialYear = y;
    initialMonthIndex = m;
  }

  let initialDay = 1;
  let bestBuddyCount = -1;
  Object.keys(tasksByDate).forEach((dateKey) => {
    const [y, m, d] = dateKey.split("-").map(Number);
    if (y !== initialYear || m !== initialMonthIndex) return;
    const count = tasksByDate[dateKey].buddies.length;
    if (count > bestBuddyCount || (count === bestBuddyCount && d < initialDay)) {
      bestBuddyCount = count;
      initialDay = d;
    }
  });

  return {
    tasksByDate,
    careBuddyTaskMap,
    careBuddyInteractionMap,
    allBuddyNames: Array.from(allBuddyNames),
    initialYear,
    initialMonthIndex,
    initialDay,
  };
};
