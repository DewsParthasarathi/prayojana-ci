import { useState } from "react";
import CustomInput from "@/components/input-component/CustomInput";
import CustomDropdown from "@/components/dropdown-component/CustomDropdown";
import ButtonComponent from "@/components/button-component/ButtonComponent";

const inputCls =
  "w-full !rounded-[0.8rem] border border-[#E0E0E0] px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF]";
const labelCls = "block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]";

const planTypeOptions = [
  { value: "Single", label: "Single" },
  { value: "Basic", label: "Basic" },
  { value: "Essential", label: "Essential" },
];

const durationOptions = [
  { value: "1 Month", label: "1 Month" },
  { value: "2 Months", label: "2 Months" },
  { value: "3 Months", label: "3 Months" },
  { value: "6 Months", label: "6 Months" },
  { value: "1 Year", label: "1 Year" },
];

const PlanHistoryForm = ({ onClose, onSubmit, initialData = null, submitLabel = "Renew" }) => {
  const [form, setForm] = useState({
    plan_type: initialData?.plan_type || "",
    duration: initialData?.duration || "",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
  });

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      plan_type: form.plan_type,
      duration: form.duration,
      start_date: form.start_date,
      end_date: form.end_date,
      paused_from: initialData?.paused_from || "-",
      paused_to: initialData?.paused_to || "-",
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
            <label className={labelCls}>Plan Type</label>
            <CustomDropdown
              name="plan_type"
              value={form.plan_type}
              options={planTypeOptions}
              onChange={setField("plan_type")}
              placeholder="Enter your plan type"
              selectClassName="!py-[1.3rem] !text-[1.6rem] !rounded-[0.8rem]"
            />
          </div>
          <div>
            <label className={labelCls}>Duration</label>
            <CustomDropdown
              name="duration"
              value={form.duration}
              options={durationOptions}
              onChange={setField("duration")}
              placeholder="Enter your duration"
              selectClassName="!py-[1.3rem] !text-[1.6rem] !rounded-[0.8rem]"
            />
          </div>
          <div>
            <label className={labelCls}>Start Date</label>
            <CustomInput
              type="date"
              value={form.start_date}
              onChange={setField("start_date")}
              placeholder="Enter your start date"
              inputClassName={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>End Date</label>
            <CustomInput
              type="date"
              value={form.end_date}
              onChange={setField("end_date")}
              placeholder="Enter your end date"
              inputClassName={inputCls}
            />
          </div>
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
    </form>
  );
};

export default PlanHistoryForm;
