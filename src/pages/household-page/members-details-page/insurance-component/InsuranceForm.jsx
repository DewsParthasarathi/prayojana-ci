import { useState } from "react";
import CustomInput from "@/components/input-component/CustomInput";
import ButtonComponent from "@/components/button-component/ButtonComponent";
import ImageUploadField from "@/components/image-component/ImageUploadField";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";

const buildInitialFormState = (insurance) => ({
  insurance_name: insurance?.insurance_name || "",
  validity_date: insurance?.validity_date || "",
  image: insurance?.image || null,
});

const inputClasses = (hasError) =>
  `w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] ${
    hasError ? "border-red-500" : "border-[#E0E0E0]"
  }`;

const InsuranceForm = ({
  household,
  elder,
  insurance,
  insuranceIndex,
  onClose,
  onSuccess,
}) => {
  const isEditMode = Boolean(insurance);
  const [formData, setFormData] = useState(() =>
    buildInitialFormState(insurance),
  );
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

    if (!formData.insurance_name.trim()) {
      nextErrors.insurance_name = "Insurance name is required.";
    }

    if (!formData.validity_date.trim()) {
      nextErrors.validity_date = "Validity date is required.";
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
      const message =
        "Unable to save insurance details. Member details are missing.";
      setSubmissionError(message);
      showToast({ variant: "error", description: message });
      return;
    }

    const insurancePayload = {
      id: insurance?.id || `INS-${Date.now()}`,
      insurance_name: formData.insurance_name.trim(),
      validity_date: formData.validity_date.trim(),
      image: formData.image || null,
    };

    const currentInsurances = Array.isArray(elder.insurance_details)
      ? elder.insurance_details
      : [];
    const updatedInsurances = isEditMode
      ? currentInsurances.map((item, index) =>
          index === insuranceIndex ? insurancePayload : item,
        )
      : [...currentInsurances, insurancePayload];

    const updatedElders = (household.elders || []).map((item) =>
      item.elder_id === elder.elder_id
        ? { ...item, insurance_details: updatedInsurances }
        : item,
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
          ? "Insurance details updated successfully."
          : "Insurance details added successfully.",
      });
      onClose?.();
    } catch (err) {
      const message = err.message || "Failed to save insurance details.";
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
          <div className="mb-[1.6rem] text-[1.6rem] text-[#D32F2F]">
            {submissionError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-x-[6rem] mr-[7.2rem] gap-y-[2.2rem]">
          <ImageUploadField
            value={formData.image}
            onChange={(dataUrl) => setFormData((prev) => ({ ...prev, image: dataUrl }))}
            fallbackLetter={formData.insurance_name?.charAt(0)?.toUpperCase() || "?"}
          />

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Insurance Name
            </label>
            <CustomInput
              type="text"
              value={formData.insurance_name}
              onChange={handleChange("insurance_name")}
              placeholder="Enter insurance name"
              inputClassName={inputClasses(formErrors.insurance_name)}
            />
            {formErrors.insurance_name ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">
                {formErrors.insurance_name}
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Validity Date
            </label>
            <CustomInput
              type="date"
              value={formData.validity_date}
              onChange={handleChange("validity_date")}
              inputClassName={inputClasses(formErrors.validity_date)}
            />
            {formErrors.validity_date ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">
                {formErrors.validity_date}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-[1.6rem] pt-[3rem] pr-[2%]  sticky pb-[2%] bottom-0 bg-[#fff]">
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

export default InsuranceForm;
