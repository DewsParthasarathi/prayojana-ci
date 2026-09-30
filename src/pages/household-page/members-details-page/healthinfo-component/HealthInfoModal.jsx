import { useEffect, useState } from "react";
import ReusableModal from "@/components/modal-component/ReusableModal";
import CustomInput from "@/components/input-component/CustomInput";
import ButtonComponent from "@/components/button-component/ButtonComponent";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";

const FIELD_LABELS = ["Health Condition 1", "Health Condition 2", "Health Condition 3"];
const REQUIRED_FIELD_COUNT = 2;

const inputClasses = (hasError) =>
  `w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] ${
    hasError ? "border-red-500" : "border-[#E0E0E0]"
  }`;

const HealthInfoModal = ({ isOpen, household, elder, onClose, onSuccess }) => {
  const [values, setValues] = useState(["", "", ""]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { patch } = useFetch();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    const currentHealthInfo = Array.isArray(elder?.health_info) ? elder.health_info : [];
    setValues([
      currentHealthInfo[0] || "",
      currentHealthInfo[1] || "",
      currentHealthInfo[2] || "",
    ]);
    setErrors({});
  }, [isOpen, elder]);

  const handleChange = (index) => (event) => {
    const nextValue = event.target.value;

    setValues((prev) => {
      const next = [...prev];
      next[index] = nextValue;
      return next;
    });

    if (errors[index] && nextValue.trim()) {
      setErrors((prev) => {
        const rest = { ...prev };
        delete rest[index];
        return rest;
      });
    }
  };

  const validate = () => {
    const nextErrors = {};

    for (let index = 0; index < REQUIRED_FIELD_COUNT; index += 1) {
      if (!values[index].trim()) {
        nextErrors[index] = "This field is required.";
      }
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!household?.id || !elder?.elder_id) {
      showToast({
        variant: "error",
        description: "Unable to save health info. Member details are missing.",
      });
      return;
    }

    const updatedHealthInfo = values.map((value) => value.trim()).filter(Boolean);

    const updatedElders = (household.elders || []).map((item) =>
      item.elder_id === elder.elder_id ? { ...item, health_info: updatedHealthInfo } : item,
    );

    setIsSubmitting(true);
    try {
      await patch(`http://localhost:4001/houseHoldData/${household.id}`, {
        elders: updatedElders,
      });

      onSuccess?.(updatedElders);
      showToast({
        variant: "success",
        description: "Health info updated successfully.",
      });
      onClose?.();
    } catch (err) {
      showToast({
        variant: "error",
        description: err.message || "Failed to update health info.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Edit Health Info" width="52rem">
      <div className="flex flex-col gap-[2.2rem]">
        {FIELD_LABELS.map((label, index) => (
          <div key={label}>
            <label className="block text-[1.6rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              {label}
              {index < REQUIRED_FIELD_COUNT ? <span className="text-red-500"> *</span> : null}
            </label>
            <CustomInput
              type="text"
              value={values[index]}
              onChange={handleChange(index)}
              placeholder={`Enter ${label.toLowerCase()}`}
              inputClassName={inputClasses(errors[index])}
            />
            {errors[index] ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">{errors[index]}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-[2.8rem]">
        <ButtonComponent
          type="button"
          loading={isSubmitting}
          onClick={handleSave}
          className="px-[3.2rem] py-[1.2rem] rounded-[0.8rem] bg-[#006BBF] text-white text-[1.8rem] font-semibold hover:bg-[#0F85E2] transition"
        >
          Save
        </ButtonComponent>
      </div>
    </ReusableModal>
  );
};

export default HealthInfoModal;
