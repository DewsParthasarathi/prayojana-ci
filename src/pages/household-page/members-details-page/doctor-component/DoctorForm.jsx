import { useRef, useState } from "react";
import CustomInput from "@/components/input-component/CustomInput";
import ButtonComponent from "@/components/button-component/ButtonComponent";
import CustomImage from "@/components/image-component/CustomImage";
import preImg from "@assets/images/create-image/img-prev.png";
import editImg from "@assets/images/create-image/edit-img.png";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { getMobileNumberError, normalizeMobileNumber } from "@/utils/validators";

const initialFormState = (doctor) => ({
  name: doctor?.name || "",
  Specialization: doctor?.Specialization || "",
  mobile_number: doctor?.mobile_number || "",
  secretary_name: doctor?.secretary_name || "",
  secretary_mobile_number: doctor?.secretary_mobile_number || "",
  instruction_for_appointment: doctor?.instruction_for_appointment || "",
  address: doctor?.address || "",
  notes: doctor?.notes || "",
  image: doctor?.image || null,
});

const inputClasses = (hasError) =>
  `w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] ${
    hasError ? "border-red-500" : "border-[#E0E0E0]"
  }`;

const DoctorForm = ({ household, elder, doctor, doctorIndex, onClose, onSuccess }) => {
  const isEditMode = Boolean(doctor);

  const [formData, setFormData] = useState(() => initialFormState(doctor));
  const [formErrors, setFormErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const { patch } = useFetch();
  const { showToast } = useToast();

  const handleChange = (field) => (event) => {
    const value =
      field === "mobile_number" || field === "secretary_mobile_number"
        ? normalizeMobileNumber(event.target.value)
        : event.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Doctor name is required.";
    }

    if (!formData.Specialization.trim()) {
      nextErrors.Specialization = "Specialization is required.";
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

    if (!household?.id || !elder?.elder_id) {
      const message = "Unable to save doctor. Member details are missing.";
      setSubmissionError(message);
      showToast({ variant: "error", description: message });
      return;
    }

    const doctorPayload = {
      name: formData.name.trim(),
      Specialization: formData.Specialization.trim(),
      mobile_number: formData.mobile_number,
      secretary_name: formData.secretary_name.trim(),
      secretary_mobile_number: formData.secretary_mobile_number,
      instruction_for_appointment: formData.instruction_for_appointment.trim(),
      address: formData.address.trim(),
      notes: formData.notes.trim(),
      image: formData.image || null,
    };

    const currentDoctors = Array.isArray(elder.doctors) ? elder.doctors : [];
    const updatedDoctors = isEditMode
      ? currentDoctors.map((item, index) => (index === doctorIndex ? doctorPayload : item))
      : [...currentDoctors, doctorPayload];

    const updatedElders = (household.elders || []).map((item) =>
      item.elder_id === elder.elder_id ? { ...item, doctors: updatedDoctors } : item,
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
          ? "Doctor details updated successfully."
          : "Doctor added successfully.",
      });
      onClose?.();
    } catch (err) {
      const message = err.message || "Failed to save doctor details.";
      setSubmissionError(message);
      showToast({ variant: "error", description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => onClose?.();

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
          {formData.image ? (
            <img
              src={formData.image || preImg}
              alt="Doctor preview"
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
          <div className="mb-[1.6rem] text-[1.6rem] text-[#D32F2F]">{submissionError}</div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[6rem] mr-[7.2rem] gap-y-[2.2rem]">
          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Doctor Name
            </label>
            <CustomInput
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Enter your doctor name"
              inputClassName={inputClasses(formErrors.name)}
            />
            {formErrors.name ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">{formErrors.name}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Specialization
            </label>
            <CustomInput
              type="text"
              value={formData.Specialization}
              onChange={handleChange("Specialization")}
              placeholder="Enter your specialization"
              inputClassName={inputClasses(formErrors.Specialization)}
            />
            {formErrors.Specialization ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">
                {formErrors.Specialization}
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Phone No
            </label>
            <CustomInput
              type="tel"
              value={formData.mobile_number}
              onChange={handleChange("mobile_number")}
              placeholder="Enter your phone no"
              inputClassName={inputClasses(formErrors.mobile_number)}
            />
            {formErrors.mobile_number ? (
              <p className="text-[#D32F2F] text-[1.4rem] mt-[0.8rem]">{formErrors.mobile_number}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Secretary Name
            </label>
            <CustomInput
              type="text"
              value={formData.secretary_name}
              onChange={handleChange("secretary_name")}
              placeholder="Enter your secretary name"
              inputClassName={inputClasses(false)}
            />
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Secretary Phone No
            </label>
            <CustomInput
              type="tel"
              value={formData.secretary_mobile_number}
              onChange={handleChange("secretary_mobile_number")}
              placeholder="Enter your secretary phone no"
              inputClassName={inputClasses(false)}
            />
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Instruction For Appointment
            </label>
            <CustomInput
              type="text"
              value={formData.instruction_for_appointment}
              onChange={handleChange("instruction_for_appointment")}
              placeholder="Enter your instruction for appointment"
              inputClassName={inputClasses(false)}
            />
          </div>

          <div>
            <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
              Address
            </label>
            <CustomInput
              type="text"
              value={formData.address}
              onChange={handleChange("address")}
              placeholder="Enter your address"
              inputClassName={inputClasses(false)}
            />
          </div>
        </div>

        <div className="mt-[2.2rem] mr-[7.2rem]">
          <label className="block text-[1.8rem] font-medium text-[#1B1A1F] mb-[0.8rem]">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={handleChange("notes")}
            placeholder="Enter your Notes..."
            rows={4}
            className="w-full !rounded-[0.8rem] border border-[#E0E0E0] px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#006BBF] resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-[1.6rem] pt-[3rem] pr-[2%]  sticky bottom-0 pb-[2%] bg-[#fff]">
        <ButtonComponent
          type="button"
          onClick={handleCancel}
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

export default DoctorForm;
