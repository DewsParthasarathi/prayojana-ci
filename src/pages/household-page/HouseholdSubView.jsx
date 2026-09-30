// import { useMemo, useState } from "react";
// import { Plus } from "lucide-react";

// import plusIcon from "@/assets/images/household-images/add-icon.png";

// import HouseholdViewFilters from "./HouseholdViewFilters";
// import CustomTable from "@/components/table-component/CustomTable";
// import ReusableSidebar from "@/components/sidebar-drawer/ReusableSidebar";
// import { getHouseholdViewConfig } from "@/config/householdViewConfig";
// import NotesModal from "./view-forms/NotesModal";
// import AttachmentModal from "./view-forms/AttachmentModal";
// import InteractionForm from "./view-forms/InteractionForm";
// import TaskForm from "./view-forms/TaskForm";
// import PlanHistoryForm from "./view-forms/PlanHistoryForm";
// import PaymentHistoryForm from "./view-forms/PaymentHistoryForm";
// import CustomImage from "@/components/image-component/CustomImage";

// const FORM_BY_VIEW = {
//   interactions: InteractionForm,
//   tasks: TaskForm,
//   plan_history: PlanHistoryForm,
//   payment_history: PaymentHistoryForm,
// };

// const renumber = (rows) =>
//   rows.map((row, index) => ({
//     ...row,
//     s_no: String(index + 1).padStart(2, "0"),
//   }));

// const uniqueOptions = (rows, field) =>
//   Array.from(new Set(rows.map((row) => row[field]).filter(Boolean))).map((value) => ({
//     value,
//     label: value,
//   }));

// const HouseholdSubView = ({ viewType, household }) => {
//   const config = getHouseholdViewConfig(viewType);
//   const FormComponent = FORM_BY_VIEW[viewType];

//   const seedRows = useMemo(() => {
//     const source = Array.isArray(household?.[config.dataKey]) ? household[config.dataKey] : [];
//     return renumber(source.map((row, index) => ({ ...row, __id: `${viewType}-${index}` })));
//   }, [household, config.dataKey, viewType]);

//   const [rows, setRows] = useState(seedRows);
//   const [filters, setFilters] = useState({});
//   const [appliedFilters, setAppliedFilters] = useState({});

//   const resetView = () => {
//     setRows(seedRows);
//     setFilters({});
//     setAppliedFilters({});
//   };

//   const [sidebar, setSidebar] = useState({ isOpen: false, mode: "create", row: null });
//   const [notesModal, setNotesModal] = useState({ isOpen: false, row: null });
//   const [attachModal, setAttachModal] = useState({ isOpen: false, row: null });

//   const filterDefs = (config.filters || []).map((def) => {
//     if (def.dynamicField) {
//       return { ...def, options: uniqueOptions(rows, def.dynamicField) };
//     }
//     return def;
//   });

//   const filteredRows = useMemo(() => {
//     let result = [...rows];
//     (config.filters || []).forEach((def) => {
//       const value = appliedFilters[def.name];
//       if (value) {
//         result = result.filter(
//           (row) => String(row[def.field] || "").toLowerCase() === value.toLowerCase(),
//         );
//       }
//     });
//     return result;
//   }, [rows, appliedFilters, config.filters]);

//   const ctx = {
//     onOpenItem: (row) => setSidebar({ isOpen: true, mode: "edit", row }),
//     onEdit: (row) => setSidebar({ isOpen: true, mode: "edit", row }),
//     onDelete: (row) => setRows((prev) => renumber(prev.filter((item) => item.__id !== row.__id))),
//     onOpenNotes: (row) => setNotesModal({ isOpen: true, row }),
//     onOpenAttachment: (row) => setAttachModal({ isOpen: true, row }),
//   };

//   const columns = useMemo(() => config.buildColumns(ctx), [config, rows, ctx]);

//   const handleFormSubmit = (payload) => {
//     if (sidebar.mode === "edit" && sidebar.row) {
//       setRows((prev) =>
//         prev.map((item) => (item.__id === sidebar.row.__id ? { ...item, ...payload } : item)),
//       );
//     } else {
//       setRows((prev) =>
//         renumber([
//           ...prev,
//           {
//             ...payload,
//             __id: `${viewType}-${Date.now()}`,
//             action: ["edit", "delete"],
//           },
//         ]),
//       );
//     }
//   };

//   const handleNotesSave = (text) => {
//     if (!notesModal.row) return;
//     setRows((prev) =>
//       prev.map((item) => (item.__id === notesModal.row.__id ? { ...item, notes: text } : item)),
//     );
//   };

//   const handleAttachSave = (files) => {
//     if (!attachModal.row) return;
//     setRows((prev) =>
//       prev.map((item) =>
//         item.__id === attachModal.row.__id
//           ? { ...item, added_images: files, attach: files.length > 0 }
//           : item,
//       ),
//     );
//   };

//   const sidebarTitle = sidebar.mode === "edit" ? config.editTitle : config.createTitle;

//   return (
//     <div className="w-full h-full flex flex-col">
//       <HouseholdViewFilters
//         title={household?.household_name || "Household"}
//         subtitle={config.label}
//         prid={household?.prid_no}
//         filterDefs={filterDefs}
//         filters={filters}
//         setFilters={setFilters}
//         onApply={(next) => setAppliedFilters(next)}
//       />

//       <div className="flex-1 overflow-y-auto pr-[1rem]">
//         <CustomTable columns={columns} data={filteredRows} keyField="__id" />
//       </div>

//       <button
//         type="button"
//         onClick={() => setSidebar({ isOpen: true, mode: "create", row: null })}
//         className="fixed bottom-[8%] right-[5%] rounded-full  text-white "
//         aria-label="add"
//       >
//         {/* <Plus className="w-[3.4rem] h-[3.4rem]" /> */}
//         <div className="w-[10rem] h-[10rem]">
//           <CustomImage src={plusIcon} alt="Sort" />
//         </div>
//       </button>

//       <ReusableSidebar
//         isOpen={sidebar.isOpen}
//         onClose={() => setSidebar({ isOpen: false, mode: "create", row: null })}
//         title={sidebarTitle}
//       >
//         {sidebar.isOpen && FormComponent ? (
//           <FormComponent
//             initialData={sidebar.mode === "edit" ? sidebar.row : null}
//             householdName={household?.household_name || ""}
//             submitLabel={sidebar.mode === "edit" ? "Save Changes" : config.createButtonLabel}
//             onSubmit={handleFormSubmit}
//             onClose={() => setSidebar({ isOpen: false, mode: "create", row: null })}
//           />
//         ) : null}
//       </ReusableSidebar>

//       <NotesModal
//         isOpen={notesModal.isOpen}
//         onClose={() => setNotesModal({ isOpen: false, row: null })}
//         initialNotes={typeof notesModal.row?.notes === "string" ? notesModal.row.notes : ""}
//         onSave={handleNotesSave}
//       />

//       <AttachmentModal
//         isOpen={attachModal.isOpen}
//         onClose={() => setAttachModal({ isOpen: false, row: null })}
//         initialFiles={
//           Array.isArray(attachModal.row?.added_images) ? attachModal.row.added_images : []
//         }
//         onSave={handleAttachSave}
//       />
//     </div>
//   );
// };

// export default HouseholdSubView;
import { useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Plus } from "lucide-react";

import plusIcon from "@/assets/images/household-images/add-icon.png";

import HouseholdViewFilters from "./HouseholdViewFilters";
import CustomTable from "@/components/table-component/CustomTable";
import ReusableSidebar from "@/components/sidebar-drawer/ReusableSidebar";
import { getHouseholdViewConfig } from "@/config/householdViewConfig";
import NotesModal from "./view-forms/NotesModal";
import AttachmentModal from "./view-forms/AttachmentModal";
import InteractionForm from "./view-forms/InteractionForm";
import TaskForm from "./view-forms/TaskForm";
import PlanHistoryForm from "./view-forms/PlanHistoryForm";
import PaymentHistoryForm from "./view-forms/PaymentHistoryForm";
import CustomImage from "@/components/image-component/CustomImage";
import { useConfirm } from "@/hooks/ConfirmContext.jsx";
import { useToast } from "@/hooks/useToast";
import useFetch from "@/hooks/useFetch";

const FORM_BY_VIEW = {
  interactions: InteractionForm,
  tasks: TaskForm,
  plan_history: PlanHistoryForm,
  payment_history: PaymentHistoryForm,
};

const renumber = (rows) =>
  rows.map((row, index) => ({
    ...row,
    s_no: String(index + 1).padStart(2, "0"),
  }));

const uniqueOptions = (rows, field) =>
  Array.from(new Set(rows.map((row) => row[field]).filter(Boolean))).map((value) => ({
    value,
    label: value,
  }));

const HouseholdSubView = ({ viewType, household }) => {
  const config = getHouseholdViewConfig(viewType);
  const FormComponent = FORM_BY_VIEW[viewType];
  const confirm = useConfirm();
  const { showToast } = useToast();
  const { patch } = useFetch();

  const seedRows = useMemo(() => {
    const source = Array.isArray(household?.[config.dataKey]) ? household[config.dataKey] : [];
    return renumber(source.map((row, index) => ({ ...row, __id: `${viewType}-${index}` })));
  }, [household, config.dataKey, viewType]);

  const [rows, setRows] = useState(seedRows);
  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  // eslint-disable-next-line no-unused-vars
  const resetView = () => {
    setRows(seedRows);
    setFilters({});
    setAppliedFilters({});
  };

  const [sidebar, setSidebar] = useState({ isOpen: false, mode: "create", row: null });
  const [notesModal, setNotesModal] = useState({ isOpen: false, row: null });
  const [attachModal, setAttachModal] = useState({ isOpen: false, row: null });

  const filterDefs = (config.filters || []).map((def) => {
    if (def.dynamicField) {
      return { ...def, options: uniqueOptions(rows, def.dynamicField) };
    }
    return def;
  });

  const filteredRows = useMemo(() => {
    let result = [...rows];
    (config.filters || []).forEach((def) => {
      const value = appliedFilters[def.name];
      if (value) {
        result = result.filter(
          (row) => String(row[def.field] || "").toLowerCase() === value.toLowerCase(),
        );
      }
    });
    return result;
  }, [rows, appliedFilters, config.filters]);

  const ctx = {
    onOpenItem: (row) => setSidebar({ isOpen: true, mode: "edit", row }),
    onEdit: (row) => setSidebar({ isOpen: true, mode: "edit", row }),
    onDelete: async (row) => {
      const ok = await confirm({
        title: "Confirm Delete",
        message: "Are you sure you want to delete this record? This action cannot be undone.",
      });
      if (!ok) return;

      const nextRows = renumber(rows.filter((item) => item.__id !== row.__id));

      if (!household?.id) {
        setRows(nextRows);
        showToast({ variant: "success", description: "Successfully deleted." });
        return;
      }

      try {
        await patch(`http://localhost:4001/houseHoldData/${household.id}`, {
          // eslint-disable-next-line no-unused-vars
          [config.dataKey]: nextRows.map(({ __id, ...rest }) => rest),
        });
        setRows(nextRows);
        showToast({ variant: "success", description: "Successfully deleted." });
      } catch (err) {
        showToast({
          variant: "error",
          description: err.message || "Failed to delete record.",
        });
      }
    },
    onOpenNotes: (row) => setNotesModal({ isOpen: true, row }),
    onOpenAttachment: (row) => setAttachModal({ isOpen: true, row }),
  };

  const columns = useMemo(() => config.buildColumns(ctx), [config, rows, ctx]);

  const handleFormSubmit = (payload) => {
    const isEdit = sidebar.mode === "edit" && sidebar.row;
    if (sidebar.mode === "edit" && sidebar.row) {
      setRows((prev) =>
        prev.map((item) => (item.__id === sidebar.row.__id ? { ...item, ...payload } : item)),
      );
    } else {
      setRows((prev) =>
        renumber([
          ...prev,
          {
            ...payload,
            __id: `${viewType}-${Date.now()}`,
            action: ["edit", "delete"],
          },
        ]),
      );
    }
    showToast({
      variant: "success",
      description: isEdit ? "Successfully updated." : "Successfully created.",
    });
  };

  const handleNotesSave = (text) => {
    if (!notesModal.row) return;
    setRows((prev) =>
      prev.map((item) => (item.__id === notesModal.row.__id ? { ...item, notes: text } : item)),
    );
    showToast({ variant: "success", description: "Successfully updated." });
  };

  const handleAttachSave = (files) => {
    if (!attachModal.row) return;
    setRows((prev) =>
      prev.map((item) =>
        item.__id === attachModal.row.__id
          ? { ...item, added_images: files, attach: files.length > 0 }
          : item,
      ),
    );
    showToast({ variant: "success", description: "Successfully updated." });
  };

  const sidebarTitle = sidebar.mode === "edit" ? config.editTitle : config.createTitle;

  return (
    <div className="w-full h-full flex flex-col">
      <HouseholdViewFilters
        title={household?.household_name || "Household"}
        subtitle={config.label}
        prid={household?.prid_no}
        filterDefs={filterDefs}
        filters={filters}
        setFilters={setFilters}
        onApply={(next) => setAppliedFilters(next)}
      />

      <div className="flex-1 overflow-y-auto pr-[1rem]">
        <CustomTable columns={columns} data={filteredRows} keyField="__id" />
      </div>

      <button
        type="button"
        onClick={() => setSidebar({ isOpen: true, mode: "create", row: null })}
        className="fixed bottom-[8%] right-[5%] rounded-full  text-white "
        aria-label="add"
      >
        {/* <Plus className="w-[3.4rem] h-[3.4rem]" /> */}
        <div className="w-[10rem] h-[10rem]">
          <CustomImage src={plusIcon} alt="Sort" />
        </div>
      </button>

      <ReusableSidebar
        isOpen={sidebar.isOpen}
        onClose={() => setSidebar({ isOpen: false, mode: "create", row: null })}
        title={sidebarTitle}
      >
        {sidebar.isOpen && FormComponent ? (
          <FormComponent
            initialData={sidebar.mode === "edit" ? sidebar.row : null}
            householdName={household?.household_name || ""}
            submitLabel={sidebar.mode === "edit" ? "Save Changes" : config.createButtonLabel}
            onSubmit={handleFormSubmit}
            onClose={() => setSidebar({ isOpen: false, mode: "create", row: null })}
          />
        ) : null}
      </ReusableSidebar>

      <NotesModal
        isOpen={notesModal.isOpen}
        onClose={() => setNotesModal({ isOpen: false, row: null })}
        initialNotes={typeof notesModal.row?.notes === "string" ? notesModal.row.notes : ""}
        onSave={handleNotesSave}
      />

      <AttachmentModal
        isOpen={attachModal.isOpen}
        onClose={() => setAttachModal({ isOpen: false, row: null })}
        initialFiles={
          Array.isArray(attachModal.row?.added_images) ? attachModal.row.added_images : []
        }
        onSave={handleAttachSave}
      />
    </div>
  );
};

export default HouseholdSubView;
