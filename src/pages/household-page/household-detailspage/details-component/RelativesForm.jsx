import { useState } from "react";
import CustomInput from "@/components/input-component/CustomInput";
import ButtonComponent from "@/components/button-component/ButtonComponent";
import ImageUploadField from "@/components/image-component/ImageUploadField";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { useHouseholdDetailRefresh } from "@/hooks/householdDetailRefreshContext";
import { getMobileNumberError, normalizeMobileNumber } from "@/utils/validators";

const initialFormState = (relative) => ({
  name: relative?.name || "",
  relation: relative?.relation || "",
  address: relative?.address || "",
  mobile_number: relative?.mobile_number || "",
  notes: relative?.notes || "",
  emergency_contact: relative?.emergency_contact || false,
  image: relative?.image || null,
});

const inputClasses = (hasError) =>
  `w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] ${
    hasError ? "border-red-500" : "border-[#E0E0E0]"
  }`;

const RelativesForm = ({ household, relative, relativeIndex, onClose, onSuccess }) => {
  const isEditMode = Boolean(relative);
  const [formData, setFormData] = useState(() => initialFormState(relative));
  const [formErrors, setFormErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { patch } = useFetch();
  const { showToast } = useToast();
  const { refreshHouseholdDetail } = useHouseholdDetailRefresh();

  const handleChange = (field) => (event) => {
    if (field === "emergency_contact") {
      setFormData((prev) => ({ ...prev, [field]: event.target.checked }));
    } else {
      const value =
        field === "mobile_number" ? normalizeMobileNumber(event.target.value) : event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Relative name is required.";
    }

    if (!formData.relation.trim()) {
      nextErrors.relation = "Relationship is required.";
    }

    const mobileError = getMobileNumberError(formData.mobile_number);
    if (mobileError) {
      nextErrors.mobile_number = mobileError;
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

    if (!household?.id) {
      const message = "Unable to save relative. Household details are missing.";
      setSubmissionError(message);
      showToast({ variant: "error", description: message });
      return;
    }

    const relativePayload = {
      name: formData.name.trim(),
      relation: formData.relation.trim(),
      address: formData.address.trim(),
      mobile_number: formData.mobile_number,
      notes: formData.notes.trim(),
      emergency_contact: formData.emergency_contact,
      image: formData.image || null,
    };

    const currentRelatives = Array.isArray(household.relatives) ? household.relatives : [];
    const updatedRelatives = isEditMode
      ? currentRelatives.map((item, index) => (index === relativeIndex ? relativePayload : item))
      : [...currentRelatives, relativePayload];

    setIsSubmitting(true);
    try {
      const serverHousehold = await patch(`http://localhost:4001/houseHoldData/${household.id}`, {
        relatives: updatedRelatives,
      });

      await refreshHouseholdDetail();
      onSuccess?.(serverHousehold || updatedRelatives);

      showToast({
        variant: "success",
        description: isEditMode
          ? "Relative details updated successfully."
          : "Relative added successfully.",
      });
      onClose?.();
    } catch (err) {
      const message = err.message || "Failed to save relative details.";
      setSubmissionError(message);
      showToast({ variant: "error", description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => onClose?.();

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col p-[3rem] pb-[2rem]">
      <h3 className="text-[2.2rem] font-semibold mb-[3rem]">
        {isEditMode ? `Edit ${relative?.name}` : "Create Relatives"}
      </h3>

      {submissionError && (
        <div className="mb-[2rem] p-[1rem] bg-red-100 border border-red-500 rounded-lg text-red-700 text-[1.4rem]">
          {submissionError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-[1rem]">
        <ImageUploadField
          value={formData.image}
          onChange={(dataUrl) => setFormData((prev) => ({ ...prev, image: dataUrl }))}
          fallbackLetter={formData.name?.charAt(0)?.toUpperCase() || "?"}
        />

        <div className="grid grid-cols-2 gap-[2rem] mb-[2rem]">
          <div>
            <label className="block text-[1.6rem] font-medium mb-[0.8rem] text-[#000]">Name</label>
            <CustomInput
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange("name")}
              inputClassName={inputClasses(formErrors.name)}
            />
            {formErrors.name && (
              <p className="text-red-500 text-[1.2rem] mt-[0.5rem]">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[1.6rem] font-medium mb-[0.8rem] text-[#000]">
              Relationship
            </label>
            <CustomInput
              type="text"
              placeholder="Enter your relationship"
              value={formData.relation}
              onChange={handleChange("relation")}
              inputClassName={inputClasses(formErrors.relation)}
            />
            {formErrors.relation && (
              <p className="text-red-500 text-[1.2rem] mt-[0.5rem]">{formErrors.relation}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[2rem] mb-[2rem]">
          <div>
            <label className="block text-[1.6rem] font-medium mb-[0.8rem] text-[#000]">
              Address
            </label>
            <CustomInput
              type="text"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange("address")}
              inputClassName={inputClasses(false)}
            />
          </div>

          <div>
            <label className="block text-[1.6rem] font-medium mb-[0.8rem] text-[#000]">
              Mobile No
            </label>
            <CustomInput
              type="text"
              placeholder="Enter your mobile no"
              value={formData.mobile_number}
              onChange={handleChange("mobile_number")}
              inputClassName={inputClasses(formErrors.mobile_number)}
            />
            {formErrors.mobile_number && (
              <p className="text-red-500 text-[1.2rem] mt-[0.5rem]">{formErrors.mobile_number}</p>
            )}
          </div>
        </div>

        <div className="mb-[2rem]">
          <label className="block text-[1.6rem] font-medium mb-[0.8rem] text-[#000]">Notes</label>
          <textarea
            placeholder="Enter your Notes..."
            value={formData.notes}
            onChange={handleChange("notes")}
            className="w-full !rounded-[0.8rem] border border-[#E0E0E0] px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] focus:outline-none resize-none h-[10rem]"
          />
        </div>

        <div className="mb-[2rem] flex items-center gap-[1rem]">
          <input
            type="checkbox"
            id="emergency-contact"
            checked={formData.emergency_contact}
            onChange={handleChange("emergency_contact")}
            className="w-[2rem] h-[2rem] cursor-pointer"
          />
          <label htmlFor="emergency-contact" className="text-[1.6rem] text-[#000] cursor-pointer">
            Emergency Contact
          </label>
        </div>
      </div>

      <div className="flex gap-[1.5rem] mt-[3rem] pt-[2rem] justify-end">
        <button
          type="button"
          onClick={handleCancel}
          className=" px-[2rem] py-[1.2rem] border-2 border-[#1486DF] text-[#1486DF] rounded-[0.8rem] font-medium text-[2.1rem] hover:bg-[#E8F4FE] transition w-[25%] rounded-[7px]"
        >
          Cancel
        </button>
        <ButtonComponent
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className=" bg-[#1486E0] text-[2.1rem] text-[#fff] w-[25%] rounded-[7px]"
        >
          {isEditMode ? "Save Changes" : "Create"}
        </ButtonComponent>
      </div>
    </form>
  );
};

export default RelativesForm;
