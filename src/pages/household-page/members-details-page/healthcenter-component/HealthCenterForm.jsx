import { useState } from "react";
import CustomInput from "@/components/input-component/CustomInput";
import ButtonComponent from "@/components/button-component/ButtonComponent";
import ImageUploadField from "@/components/image-component/ImageUploadField";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";

const buildInitialFormState = (healthCenter) => ({
  centername: healthCenter?.centername || "",
  telephone_number: healthCenter?.telephone_number || "",
  image: healthCenter?.image || null,
});

const inputClasses = (hasError) =>
  `w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] ${
    hasError ? "border-red-500" : "border-[#E0E0E0]"
  }`;

const HealthCenterForm = ({
  household,
  elder,
  healthCenter,
  healthCenterIndex,
  onClose,
  onSuccess,
}) => {
  const isEditMode = Boolean(healthCenter);
  const [formData, setFormData] = useState(() => buildInitialFormState(healthCenter));
  const [formErrors, setFormErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { patch } = useFetch();
  const { showToast } = useToast();

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.centername.trim()) {
      nextErrors.centername = "Center name is required.";
    }

    if (!formData.telephone_number.trim()) {
      nextErrors.telephone_number = "Telephone number is required.";
    }

    setFormErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!household?.id || !elder?.elder_id) {
      const message = "Unable to save health center. Member details are missing.";
      setSubmissionError(message);
      showToast({ variant: "error", description: message });
      return;
    }

    const healthCenterPayload = {
      id: healthCenter?.id || `HC-${Date.now()}`,
      centername: formData.centername.trim(),
      telephone_number: formData.telephone_number.trim(),
      image: formData.image || null,
    };

    const currentCenters = Array.isArray(elder.health_centers) ? elder.health_centers : [];
    const updatedCenters = isEditMode
      ? currentCenters.map((item, index) =>
          index === healthCenterIndex ? healthCenterPayload : item,
        )
      : [...currentCenters, healthCenterPayload];

    const updatedElders = (household.elders || []).map((item) =>
      item.elder_id === elder.elder_id ? { ...item, health_centers: updatedCenters } : item,
    );

    setIsSubmitting(true);
    try {
      await patch(`http://localhost:4001/houseHoldData/${household.id}`, {
        elders: updatedElders,
      });

      onSuccess?.(updatedElders);

      showToast({
        variant: "success",
        description: isEditMode
          ? "Health center updated successfully."
          : "Health center Created successfully.",
      });
      onClose?.();
    } catch (err) {
      const message = err.message || "Failed to save health center details.";
      setSubmissionError(message);
      showToast({ variant: "error", description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col justify-between py-[4.5rem]"
    >
      <div>
        {submissionError ? (
          <div className="mb-[1.6rem] text-[1.6rem] text-[#D32F2F]">{submissionError}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-x-[6rem] mr-[7.2rem] gap-y-[2.2rem]">
          <ImageUploadField
            value={formData.image}
            onChange={(dataUrl) => setFormData((prev) => ({ ...prev, image: dataUrl }))}
            fallbackLetter={formData.centername?.charAt(0)?.toUpperCase() || "?"}
          />

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Center Name
            </label>
            <CustomInput
              type="text"
              value={formData.centername}
              onChange={handleChange("centername")}
              placeholder="Enter center name"
              inputClassName={inputClasses(formErrors.centername)}
            />
            {formErrors.centername ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">{formErrors.centername}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Telephone Number
            </label>
            <CustomInput
              type="text"
              value={formData.telephone_number}
              onChange={handleChange("telephone_number")}
              placeholder="Enter telephone number"
              inputClassName={inputClasses(formErrors.telephone_number)}
            />
            {formErrors.telephone_number ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">
                {formErrors.telephone_number}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-[1.6rem] pt-[3rem] pr-[2%]  sticky bottom-0 pb-[2%] bg-[#fff]">
        <ButtonComponent
          type="button"
          onClick={onClose}
          className="px-[2.8rem] w-[24.3rem] py-[1.2rem] rounded-[0.8rem] border border-[#006BBF] text-[#006BBF] text-[2.1rem] font-semibold hover:bg-[#F0F7FF] transition"
        >
          Cancel
        </ButtonComponent>
        <ButtonComponent
          type="submit"
          loading={isSubmitting}
          className="px-[2.8rem] py-[1.2rem] w-[24.3rem] rounded-[0.8rem] bg-[#006BBF] text-white text-[2.1rem] font-semibold hover:bg-[#0F85E2] transition"
        >
          {isEditMode ? "Save Changes" : "Create"}
        </ButtonComponent>
      </div>
    </form>
  );
};

export default HealthCenterForm;
