import { useState } from "react";
import ReusableModal from "@/components/modal-component/ReusableModal";
import CustomDateInput from "@/components/input-component/CustomDateInput";
import ButtonComponent from "@/components/button-component/ButtonComponent";

const StatusChangeModal = ({ isOpen, onClose, targetStatus, onConfirm }) => {
  const isActivating = targetStatus === "active";

  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetAndClose = () => {
    setDate("");
    setReason("");
    setErrors({});
    setIsSubmitting(false);
    onClose?.();
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: "" }));
    }
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
    if (errors.reason) {
      setErrors((prev) => ({ ...prev, reason: "" }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!date) {
      nextErrors.date = isActivating
        ? "Active from date is required."
        : "Paused from date is required.";
    }

    if (!reason.trim()) {
      nextErrors.reason = "Reason is required.";
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm?.({ date, reason: reason.trim() });
      resetAndClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={isActivating ? "Active Status" : "Paused Status"}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-[2rem]">
          <label className="block text-[1.6rem] font-medium mb-[0.8rem] text-[#000]">
            {isActivating ? "Active From" : "Paused From"}
          </label>
          <CustomDateInput
            value={date}
            onChange={handleDateChange}
            hasError={Boolean(errors.date)}
          />
          {errors.date && <p className="text-red-500 text-[1.2rem] mt-[0.5rem]">{errors.date}</p>}
        </div>

        <div className="mb-[2.4rem]">
          <label className="block text-[1.6rem] font-medium mb-[0.8rem] text-[#000]">Reason</label>
          <textarea
            placeholder="Enter your reason..."
            value={reason}
            onChange={handleReasonChange}
            className={`w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#1486DF] focus:outline-none resize-none h-[12rem] ${
              errors.reason ? "border-red-500" : "border-[#E0E0E0]"
            }`}
          />
          {errors.reason && (
            <p className="text-red-500 text-[1.2rem] mt-[0.5rem]">{errors.reason}</p>
          )}
        </div>

        <div className="flex justify-end">
          <ButtonComponent
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className={`px-[3rem] py-[1.2rem] rounded-[0.8rem] text-[1.8rem] font-semibold text-white transition ${
              isActivating ? "bg-[#22BE4E] hover:bg-[#1ea844]" : "bg-[#1486DF] hover:bg-[#0f6cb8]"
            }`}
          >
            {isActivating ? "Active" : "Pause"}
          </ButtonComponent>
        </div>
      </form>
    </ReusableModal>
  );
};

export default StatusChangeModal;
