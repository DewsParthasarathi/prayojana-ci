import { useState } from "react";
import CustomInput from "@/components/input-component/CustomInput";
import CustomDropdown from "@/components/dropdown-component/CustomDropdown";
import ButtonComponent from "@/components/button-component/ButtonComponent";
import { Plus } from "lucide-react";
import AttachmentModal from "./AttachmentModal";

const inputCls =
  "w-full !rounded-[0.8rem] border border-[#E0E0E0] px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF]";
const labelCls = "block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]";
const errorCls = "text-[#D32F2F] text-[1.4rem] mt-[0.8rem]";

const inputClasses = (hasError) =>
  `w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] ${
    hasError ? "border-red-500" : "border-[#E0E0E0]"
  }`;

const statusOptions = [
  { value: "Completed", label: "Completed" },
  { value: "Overdue", label: "Overdue" },
  { value: "In-Progress", label: "In-Progress" },
  { value: "Cancelled", label: "Cancelled" },
];

const TaskForm = ({
  onClose,
  onSubmit,
  initialData = null,
  submitLabel = "Save Changes",
  householdName = "",
}) => {
  const [form, setForm] = useState({
    task_name: initialData?.task_name || "",
    household: initialData?.member_name || householdName || "",
    due_date: initialData?.date || "",
    due_time: initialData?.time || "",
    assigned_to: initialData?.created_by || "",
    status: initialData?.status || "",
    notes: typeof initialData?.notes === "string" ? initialData.notes : "",
  });
  const [attachments, setAttachments] = useState(
    Array.isArray(initialData?.added_images) ? initialData.added_images : [],
  );
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const setField = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.task_name.trim()) {
      nextErrors.task_name = "Task name is required.";
    }
    if (!form.household.trim()) {
      nextErrors.household = "Household is required.";
    }
    if (!form.due_date) {
      nextErrors.due_date = "Due date is required.";
    }
    if (!form.assigned_to.trim()) {
      nextErrors.assigned_to = "Assigned to is required.";
    }
    if (!form.status) {
      nextErrors.status = "Status is required.";
    }

    setFormErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit?.({
      task_name: form.task_name,
      member_name: form.household,
      date: form.due_date,
      time: form.due_time,
      created_by: form.assigned_to,
      status: form.status,
      notes: form.notes,
      added_images: attachments,
      attach: attachments.length > 0,
    });
    onClose?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col justify-between py-[4.5rem]"
    >
      <div className="pr-[7.2rem]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[6rem] gap-y-[2.6rem]">
          <div>
            <label className={labelCls}>Task Name</label>
            <CustomInput
              value={form.task_name}
              onChange={setField("task_name")}
              placeholder="Enter your task name"
              inputClassName={inputClasses(formErrors.task_name)}
            />
            {formErrors.task_name ? <p className={errorCls}>{formErrors.task_name}</p> : null}
          </div>
          <div>
            <label className={labelCls}>Household</label>
            <CustomInput
              value={form.household}
              onChange={setField("household")}
              placeholder="Enter your member name"
              inputClassName={inputClasses(formErrors.household)}
            />
            {formErrors.household ? <p className={errorCls}>{formErrors.household}</p> : null}
          </div>

          <div>
            <label className={labelCls}>Due</label>
            <div className="flex gap-[1.4rem]">
              <CustomInput
                type="date"
                value={form.due_date}
                onChange={setField("due_date")}
                inputClassName={inputClasses(formErrors.due_date)}
              />
              <CustomInput
                type="time"
                value={form.due_time}
                onChange={setField("due_time")}
                inputClassName={inputCls}
              />
            </div>
            {formErrors.due_date ? <p className={errorCls}>{formErrors.due_date}</p> : null}
          </div>
          <div>
            <label className={labelCls}>Assigned To</label>
            <CustomInput
              value={form.assigned_to}
              onChange={setField("assigned_to")}
              placeholder="Enter your assigned by"
              inputClassName={inputClasses(formErrors.assigned_to)}
            />
            {formErrors.assigned_to ? <p className={errorCls}>{formErrors.assigned_to}</p> : null}
          </div>
        </div>

        <div className="mt-[2.6rem]">
          <label className={labelCls}>Status</label>
          <CustomDropdown
            name="status"
            value={form.status}
            options={statusOptions}
            onChange={setField("status")}
            placeholder="Enter your status"
            selectClassName="!py-[1.3rem] !text-[1.6rem] !rounded-[0.8rem]"
            error={formErrors.status}
          />
        </div>

        <div className="mt-[2.6rem]">
          <label className={labelCls}>Notes</label>
          <textarea
            value={form.notes}
            onChange={setField("notes")}
            placeholder="Enter your Notes..."
            className="w-full h-[12rem] rounded-[0.8rem] border border-[#E0E0E0] p-[1.6rem] text-[1.6rem] resize-none focus:outline-none focus:border-[#006BBF]"
          />
        </div>

        <div className="mt-[2.6rem]">
          <label className={labelCls}>Attachment</label>
          <button
            type="button"
            onClick={() => setIsAttachOpen(true)}
            className="w-[12rem] h-[12rem] rounded-[0.8rem] border-2 border-dashed border-[#9CC7EC] bg-[#F6FAFE] flex items-center justify-center"
          >
            {attachments.length ? (
              <span className="text-[1.6rem] text-[#006BBF] font-semibold">
                {attachments.length} file(s)
              </span>
            ) : (
              <Plus className="w-[3rem] h-[3rem] text-[#006BBF]" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-[1.6rem] pt-[3rem] sticky bottom-0 pb-[2%] bg-[#fff]">
        <ButtonComponent
          type="button"
          onClick={onClose}
          className="px-[2.8rem] w-[24.3rem] py-[1.2rem] rounded-[0.8rem] border border-[#006BBF] text-[#006BBF] text-[2.1rem] font-semibold hover:bg-[#F0F7FF] transition"
        >
          Cancel
        </ButtonComponent>
        <ButtonComponent
          type="submit"
          className="px-[2.8rem] py-[1.2rem] w-[24.3rem] rounded-[0.8rem] bg-[#006BBF] text-white text-[2.1rem] font-semibold hover:bg-[#0F85E2] transition"
        >
          {submitLabel}
        </ButtonComponent>
      </div>

      <AttachmentModal
        isOpen={isAttachOpen}
        onClose={() => setIsAttachOpen(false)}
        initialFiles={attachments}
        onSave={setAttachments}
      />
    </form>
  );
};

export default TaskForm;
