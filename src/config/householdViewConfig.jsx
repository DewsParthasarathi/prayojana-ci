import activePin from "@/assets/images/detailspage-img/active-pin.svg";
import nonActivePin from "@/assets/images/detailspage-img/non-active-pin.svg";
import activeNote from "@/assets/images/detailspage-img/active-note.svg";
import nonActiveNote from "@/assets/images/detailspage-img/non-active-notes.svg";
import sortHeader from "@assets/images/detailspage-img/sort-icon.png";
import CustomImage from "@/components/image-component/CustomImage";
import editIcon from "@assets/images/detailspage-img/edit.png";
import deleteIcon from "@assets/images/detailspage-img/delete.png";

const HEADER_CLASS = "font-semibold bg-[#0000001A] text-gray-700 text-[1.8rem] py-[2.3rem] ";

const sortableHeader = (label) => (
  <span style={{ whiteSpace: "nowrap" }} className="inline-flex items-start gap-[0.6rem] ">
    {label}
    <div className="w-[1.2rem] h-[1.2rem]">
      <CustomImage src={sortHeader} alt="Sort" />
    </div>
  </span>
);

const statusColor = (status = "") => {
  const value = status.toLowerCase();
  if (value === "completed") return "text-[#1CA66F] font-medium";
  if (value === "overdue") return "text-[#FA0F19] font-medium";
  if (value === "in-progress" || value === "inprogress" || value === "in progress")
    return "text-[#E8871E] font-medium";
  if (value === "cancelled") return "text-[#8A8A8A] font-medium";
  return "text-[#1B1A1F]";
};

const AttachCell = (row, ctx) => {
  const isActive = Boolean(
    row.attach || (Array.isArray(row.added_images) && row.added_images.length),
  );
  return (
    <button
      type="button"
      onClick={() => ctx.onOpenAttachment?.(row)}
      className={`w-[4.6rem] h-[4.6rem] rounded-[0.8rem] flex items-center justify-center transition ${
        isActive ? "bg-[#EBF0F5]" : "bg-[#E4E4E4]"
      }`}
      aria-label="attachments"
    >
      {isActive ? (
        <div className="w-[2rem] h-[2rem]">
          <CustomImage src={activePin} alt="Sort" />
        </div>
      ) : (
        <div className="w-[2rem] h-[2rem]">
          <CustomImage src={nonActivePin} alt="Sort" />
        </div>
      )}
    </button>
  );
};

const NotesCell = (row, ctx) => {
  const isActive = Boolean(typeof row.notes === "string" ? row.notes.trim() : row.notes);
  return (
    <button
      type="button"
      onClick={() => ctx.onOpenNotes?.(row)}
      className={`w-[4.6rem] h-[4.6rem] rounded-[0.8rem] flex items-center justify-center transition ${
        isActive ? "bg-[#EBF0F5]" : "bg-[#EAEAEA]"
      }`}
      aria-label="notes"
    >
      {/* <NotebookText
        className={`w-[2rem] h-[2rem] ${isActive ? "text-[#006BBF]" : "text-[#B8B8B8]"}`}
      /> */}

      {isActive ? (
        <div className="w-[2rem] h-[2rem]">
          <CustomImage src={activeNote} alt="Sort" />
        </div>
      ) : (
        <div className="w-[2rem] h-[2rem]">
          <CustomImage src={nonActiveNote} alt="Sort" />
        </div>
      )}
    </button>
  );
};

const ActionCell = (row, ctx, { editable = true } = {}) => (
  <div className="flex gap-[0.8rem]">
    {editable ? (
      <button
        type="button"
        onClick={() => ctx.onEdit?.(row)}
        className="w-[4.6rem] h-[4.6rem] rounded-[0.8rem] bg-[#006BBF5] flex items-center justify-center"
        aria-label="edit"
      >
        <div className="w-[2rem] h-[2rem]">
          <CustomImage src={editIcon} alt="Sort" />
        </div>
      </button>
    ) : null}
    <button
      type="button"
      onClick={() => ctx.onDelete?.(row)}
      className="w-[4.6rem] h-[4.6rem] rounded-[0.8rem] bg-[#FA0F195] flex items-center justify-center"
      aria-label="delete"
    >
      <div className="w-[2rem] h-[2rem]">
        <CustomImage src={deleteIcon} alt="Sort" />
      </div>
    </button>
  </div>
);

const primaryTextCell = (row, ctx, accessor) => (
  <span
    onClick={() => ctx.onOpenItem?.(row)}
    className="cursor-pointer text-[#006BBF] hover:underline"
  >
    {row[accessor]}
  </span>
);

export const HOUSEHOLD_VIEW_TYPES = {
  interactions: "interactions",
  tasks: "tasks",
  plan_history: "plan_history",
  payment_history: "payment_history",
};

export const DETAILS_OPTION_TO_VIEW = {
  Interactions: "interactions",
  Tasks: "tasks",
  "Plan History": "plan_history",
  "Payment History": "payment_history",
};

const commonListFilters = [
  {
    name: "status",
    placeholder: "Status",
    field: "status",
    options: [
      { value: "Completed", label: "Completed" },
      { value: "Overdue", label: "Overdue" },
      { value: "In-Progress", label: "In-Progress" },
      { value: "Cancelled", label: "Cancelled" },
    ],
  },
  {
    name: "createdBy",
    placeholder: "Created By",
    field: "created_by",
    options: [
      { value: "Captain", label: "Captain" },
      { value: "Self Task", label: "Self Task" },
    ],
  },
  {
    name: "date",
    placeholder: "Date",
    field: "date",
    options: [],
    dynamicField: "date",
  },
  {
    name: "time",
    placeholder: "Time",
    field: "time",
    options: [],
    dynamicField: "time",
  },
];

export const householdViewConfig = {
  interactions: {
    label: "Interactions",
    dataKey: "interactions",
    createTitle: "Create Interactions",
    editTitle: "Edit Interactions",
    createButtonLabel: "Create",
    filters: commonListFilters,
    buildColumns: (ctx) => [
      { header: "S.No", accessor: "s_no", headerClassName: HEADER_CLASS },
      {
        header: "Interactions",
        sortable: true,
        sortAccessor: "interaction",
        sortType: "string",
        headerClassName: HEADER_CLASS,
        render: (row) => primaryTextCell(row, ctx, "interaction"),
      },
      {
        header: "Member Name",
        accessor: "member_name",
        sortable: true,
        sortType: "string",
        headerClassName: HEADER_CLASS,
      },
      {
        header: "Created By",
        accessor: "created_by",
        sortable: true,
        sortType: "string",
        headerClassName: HEADER_CLASS,
      },
      { header: "Time", accessor: "time", headerClassName: HEADER_CLASS },
      { header: "Date", accessor: "date", headerClassName: HEADER_CLASS },
      {
        header: "Status",
        headerClassName: HEADER_CLASS,
        render: (row) => <span className={statusColor(row.status)}>{row.status}</span>,
      },
      {
        header: "Attach",
        headerClassName: HEADER_CLASS,
        render: (row) => AttachCell(row, ctx),
      },
      {
        header: "Notes",
        headerClassName: HEADER_CLASS,
        render: (row) => NotesCell(row, ctx),
      },
      {
        header: "Action",
        headerClassName: HEADER_CLASS,
        render: (row) => ActionCell(row, ctx),
      },
    ],
  },

  tasks: {
    label: "Tasks",
    dataKey: "tasks",
    createTitle: "Create Task",
    editTitle: "Edit Task",
    createButtonLabel: "Save Changes",
    filters: commonListFilters,
    buildColumns: (ctx) => [
      { header: "S.No", accessor: "s_no", headerClassName: HEADER_CLASS },
      {
        header: "Tasks",
        sortable: true,
        sortAccessor: "task_name",
        sortType: "string",
        headerClassName: HEADER_CLASS,
        render: (row) => primaryTextCell(row, ctx, "task_name"),
      },
      {
        header: "Member Name",
        accessor: "member_name",
        sortable: true,
        sortType: "string",
        headerClassName: HEADER_CLASS,
      },
      {
        header: "Created By",
        accessor: "created_by",
        sortable: true,
        sortType: "string",
        headerClassName: HEADER_CLASS,
      },
      { header: "Time", accessor: "time", headerClassName: HEADER_CLASS },
      { header: "Date", accessor: "date", headerClassName: HEADER_CLASS },
      {
        header: "Status",
        headerClassName: HEADER_CLASS,
        render: (row) => <span className={statusColor(row.status)}>{row.status}</span>,
      },
      {
        header: "Attach",
        headerClassName: HEADER_CLASS,
        render: (row) => AttachCell(row, ctx),
      },
      {
        header: "Notes",
        headerClassName: HEADER_CLASS,
        render: (row) => NotesCell(row, ctx),
      },
      {
        header: "Action",
        headerClassName: HEADER_CLASS,
        render: (row) => ActionCell(row, ctx),
      },
    ],
  },

  plan_history: {
    label: "Plan History",
    dataKey: "plan_history",
    createTitle: "Create Renew Plan",
    editTitle: "Edit Plan",
    createButtonLabel: "Renew",
    filters: [],
    buildColumns: (ctx) => [
      { header: "S.No", accessor: "s_no", headerClassName: HEADER_CLASS },
      {
        header: "Plan Type",
        accessor: "plan_type",
        sortable: true,
        sortType: "string",
        headerClassName: HEADER_CLASS,
      },
      {
        header: "Start Date",
        accessor: "start_date",
        sortable: true,
        sortType: "date",
        headerClassName: HEADER_CLASS,
      },
      {
        header: "Duration",
        accessor: "duration",
        sortable: true,
        sortType: "number",
        headerClassName: HEADER_CLASS,
      },
      { header: "End Date", accessor: "end_date", headerClassName: HEADER_CLASS },
      {
        header: "Paused From",
        accessor: "paused_from",
        headerClassName: HEADER_CLASS,
      },
      { header: "Paused To", accessor: "paused_to", headerClassName: HEADER_CLASS },
      {
        header: "Action",
        headerClassName: HEADER_CLASS,
        render: (row) => ActionCell(row, ctx),
      },
    ],
  },

  payment_history: {
    label: "Payment History",
    dataKey: "payment_history",
    createTitle: "Create Payment",
    editTitle: "Edit Payment",
    createButtonLabel: "Create",
    filters: [],
    buildColumns: (ctx) => [
      { header: "S.No", accessor: "s_no", headerClassName: HEADER_CLASS },
      {
        header: "Payment Date",
        accessor: "payment_date",
        sortable: true,
        sortType: "date",
        headerClassName: HEADER_CLASS,
      },
      {
        header: "Bill Amount",
        accessor: "bill_amount",
        sortable: true,
        sortType: "number",
        headerClassName: HEADER_CLASS,
      },
      {
        header: "Amount Paid",
        accessor: "amount_paid",
        sortable: true,
        sortType: "number",
        headerClassName: HEADER_CLASS,
      },
      {
        header: "Part Payment",
        accessor: "part_payment",
        sortable: true,
        sortType: "number",
        headerClassName: HEADER_CLASS,
      },
      {
        header: "Amount Due",
        accessor: "amount_due",
        sortable: true,
        sortType: "number",
        headerClassName: HEADER_CLASS,
      },
      {
        header: "Due Date",
        accessor: "due_date",
        sortable: true,
        sortType: "date",
        headerClassName: HEADER_CLASS,
      },
      {
        header: "Action",
        headerClassName: HEADER_CLASS,
        render: (row) => ActionCell(row, ctx),
      },
    ],
  },
};

export const getHouseholdViewConfig = (viewType) => householdViewConfig[viewType] || null;
