import { useState } from "react";
import CustomInput from "@/components/input-component/CustomInput";
import ButtonComponent from "@/components/button-component/ButtonComponent";

const inputCls =
  "w-full !rounded-[0.8rem] border border-[#E0E0E0] px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF]";
const labelCls = "block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]";

const PaymentHistoryForm = ({ onClose, onSubmit, initialData = null, submitLabel = "Create" }) => {
  const [form, setForm] = useState({
    payment_date: initialData?.payment_date || "",
    bill_amount: initialData?.bill_amount || "",
    amount_paid: initialData?.amount_paid || "",
    part_payment: initialData?.part_payment || "",
    amount_due: initialData?.amount_due || "",
    due_date: initialData?.due_date || "",
  });

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({ ...form });
    onClose?.();
  };

  const fields = [
    { key: "payment_date", label: "Payment Date", type: "date" },
    { key: "bill_amount", label: "Bill Amount", type: "text" },
    { key: "amount_paid", label: "Amount Paid", type: "text" },
    { key: "part_payment", label: "Part Payment", type: "text" },
    { key: "amount_due", label: "Amount Due", type: "text" },
    { key: "due_date", label: "Due Date", type: "date" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col justify-between py-[4.5rem]"
    >
      <div className="pr-[7.2rem]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[6rem] gap-y-[2.6rem]">
          {fields.map((field) => (
            <div key={field.key}>
              <label className={labelCls}>{field.label}</label>
              <CustomInput
                type={field.type}
                value={form[field.key]}
                onChange={setField(field.key)}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                inputClassName={inputCls}
              />
            </div>
          ))}
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

export default PaymentHistoryForm;
