import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CustomInput from "@/components/input-component/CustomInput";
import ButtonComponent from "@/components/button-component/ButtonComponent";
import preImg from "@assets/images/create-image/img-prev.png";
import CustomImage from "@/components/image-component/CustomImage";
import editImg from "@assets/images/create-image/edit-img.png";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { useHouseholdDetailRefresh } from "@/hooks/householdDetailRefreshContext.jsx";
import {
  getMobileNumberError,
  normalizeMobileNumber,
} from "@/utils/validators";
const initialFormState = {
  name: "",
  dateOfBirth: "",
  telephoneNo: "",
  mobileNo: "",
};

const AddMemberForm = ({ onClose }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);
  const { householdId } = useParams();
  const { currentHousehold, refreshHouseholdDetail } =
    useHouseholdDetailRefresh();

  const handleChange = (field) => (event) => {
    const value =
      field === "mobileNo"
        ? normalizeMobileNumber(event.target.value)
        : event.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    const mobileError = getMobileNumberError(formData.mobileNo);
    if (mobileError) {
      nextErrors.mobileNo = mobileError;
    }

    if (!formData.dateOfBirth) {
      nextErrors.dateOfBirth = "Date of birth is required.";
    }

    setFormErrors(nextErrors);
    return nextErrors;
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  };

  const { data: fetchedHouseholdData, error: householdError } = useFetch(
    !currentHousehold && householdId
      ? `http://localhost:4001/houseHoldData/${householdId}`
      : null,
  );
  const { patch } = useFetch();
  const { showToast } = useToast();
  const householdData = currentHousehold || fetchedHouseholdData;

  const handleAddElder = async (formData) => {
    if (!householdId) {
      throw new Error("Household ID is missing.");
    }

    if (!householdData) {
      throw new Error(
        householdError || "Unable to load household details before saving.",
      );
    }

    const currentElders = Array.isArray(householdData.elders)
      ? householdData.elders
      : [];

    if (currentElders.length >= 2) {
      throw new Error("Only 2 members are allowed.");
    }

    const newElder = {
      elder_id: `E${currentElders.length + 1}`,
      name: formData.name,
      age: 65,
      date_of_birth: formData.dateOfBirth,
      mobile_number: formData.mobileNo,
      telephone_number: formData.telephoneNo,
    };

    const updatedElders = [...currentElders, newElder];

    const response = await patch(
      `http://localhost:4001/houseHoldData/${householdId}`,
      {
        elders: updatedElders,
      },
    );

    await refreshHouseholdDetail();
    return response;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await handleAddElder(formData);
      showToast({
        variant: "success",
        description: "Member added successfully.",
      });
      onClose?.();
    } catch (err) {
      const errorMessage =
        err.message === "Only 2 members are allowed."
          ? "Only 2 members are allowed."
          : err.message || "Failed to create member.";
      setSubmissionError(errorMessage);
      showToast({
        variant: "error",
        description: errorMessage,
      });
    }
  };

  const handleCancel = () => {
    onClose?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col justify-between py-[4.5rem]"
    >
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-[25%] h-auto mb-[6.9rem] rounded-[1.2rem] bg-[#F0F0F0] flex items-center justify-center overflow-hidden"
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Member preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="">
              <CustomImage src={preImg} alt="pre image" />
            </div>
          )}

          <span className="absolute bottom-[0.8rem] right-[0.8rem] w-[3rem] h-[3rem] rounded-[0.8rem] bg-[#8A8A8A] flex items-center justify-center">
            <CustomImage src={editImg} />
          </span>
        </button>

        {submissionError ? (
          <div className="mb-[1.6rem] text-[1.6rem] text-[#D32F2F]">
            {submissionError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[6rem] mr-[7.2rem] gap-y-[2.2rem] mt-[3rem]">
          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Name
            </label>
            <CustomInput
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Enter your name"
              inputClassName={`w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] ${
                formErrors.name ? "border-red-500" : "border-[#E0E0E0]"
              }`}
            />
            {formErrors.name ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">
                {formErrors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Date Of Birth
            </label>
            <CustomInput
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange("dateOfBirth")}
              placeholder="Enter your date of birth"
              inputClassName={`w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] ${
                formErrors.dateOfBirth ? "border-red-500" : "border-[#E0E0E0]"
              }`}
            />
            {formErrors.dateOfBirth ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">
                {formErrors.dateOfBirth}
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Telephone No
            </label>
            <CustomInput
              type="tel"
              value={formData.telephoneNo}
              onChange={handleChange("telephoneNo")}
              placeholder="Enter your telephone no"
              inputClassName="w-full !rounded-[0.8rem] border border-[#E0E0E0] px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF]"
            />
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Mobile No
            </label>
            <CustomInput
              type="tel"
              value={formData.mobileNo}
              onChange={handleChange("mobileNo")}
              placeholder="Enter your mobile no"
              inputClassName={`w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] ${
                formErrors.mobileNo ? "border-red-500" : "border-[#E0E0E0]"
              }`}
            />
            {formErrors.mobileNo ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">
                {formErrors.mobileNo}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-[1.6rem] pt-[3rem] sticky bottom-0 pb-[2%] pr-[2%] bg-[#fff]">
        <ButtonComponent
          type="button"
          onClick={handleCancel}
          className="px-[2.8rem] w-[24.3rem] py-[1.2rem] rounded-[0.8rem] border border-[#006BBF] text-[#006BBF] text-[2.1rem] font-semibold hover:bg-[#F0F7FF] transition"
        >
          Cancel
        </ButtonComponent>
        <ButtonComponent
          type="submit"
          className="px-[2.8rem] py-[1.2rem] w-[24.3rem] rounded-[0.8rem] bg-[#006BBF] text-white text-[2.1rem] font-semibold hover:bg-[#0F85E2] transition"
        >
          Create
        </ButtonComponent>
      </div>
    </form>
  );
};

export default AddMemberForm;
