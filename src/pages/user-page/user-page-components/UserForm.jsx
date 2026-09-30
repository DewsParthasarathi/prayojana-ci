import React, { useMemo, useRef, useState } from "react";
import Accordion from "@/components/accordion/Accordion";
import CustomInput from "@/components/input-component/CustomInput";
import CustomDateInput from "@/components/input-component/CustomDateInput";
import ButtonComponent from "@/components/button-component/ButtonComponent";
import CustomImage from "@/components/image-component/CustomImage";
import addImage from "@assets/images/create-image/img-prev.png";
import cameraIcon from "@assets/images/create-image/form-edit.png";
import CustomDropdown from "@/components/dropdown-component/CustomDropdown";

const SECTION_CARD = "mb-[2.4rem] ";
const LABEL = "block text-[1.4rem] text-(--color-liteGray) mb-[0.8rem]";
const INPUT =
  "w-full !rounded-[0.8rem] border px-[1.6rem] py-[1.3rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:border-[#1486DF] outline-none";
const ERROR_TXT = "text-red-500 text-[1.2rem] mt-[0.4rem]";
const REQUIRED = <span className="text-red-500"> *</span>;

const STATUS_OPTIONS = ["Active", "Inactive"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];

const emptyForm = {
  empId: "",
  dateOfJoining: "",
  currentDesignation: "",
  businessEmail: "",
  emergencyContact: "",
  status: "",
  name: "",
  phoneNo: "",
  gender: "",
  dob: "",
  bloodGroup: "",
  referredBy: "",
  previousJobInfo: "",
  notes: "",
  interests: "",
  traits: "",
  educationalQualification: "",
  languageKnown: "",
  certifications: "",
  skills: "",
};

export const adminToForm = (admin) => {
  if (!admin) return emptyForm;
  const emp = admin.employeeInfo || {};
  const per = admin.personalInfo || {};
  const bg = admin.backgroundInfo || {};
  const prof = admin.professionalInfo || {};
  const pers = admin.personalityInfo || {};
  return {
    empId: admin.empId || "",
    dateOfJoining: emp.dateOfJoining || "",
    currentDesignation: emp.currentDesignation || admin.role || "",
    businessEmail: emp.businessEmail || admin.email || "",
    emergencyContact: admin.telephone || "",
    status: admin.status || "",
    name: admin.name || "",
    phoneNo: admin.mobile || "",
    gender: per.gender || "",
    dob: per.dateOfBirth || "",
    bloodGroup: per.bloodGroup || "",
    referredBy: bg.referredBy || "",
    previousJobInfo: bg.previousJobInfo || "",
    notes: bg.backgroundCheckInfo || "",
    interests: (pers.interests || []).join(", "),
    traits: (pers.traits || []).join(", "),
    educationalQualification: prof.educationalQualification || "",
    languageKnown: (prof.languagesKnown || []).join(", "),
    certifications: (prof.certificates || []).join(", "),
    skills: (prof.skills || []).join(", "),
  };
};

const splitList = (v) =>
  v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const formToAdmin = (form, base = {}) => ({
  ...base,
  empId: form.empId,
  img: base.img || "",
  name: form.name,
  mobile: form.phoneNo,
  telephone: form.emergencyContact,
  role: form.currentDesignation,
  status: form.status,
  email: form.businessEmail,
  employeeInfo: {
    ...(base.employeeInfo || {}),
    dateOfJoining: form.dateOfJoining,
    currentDesignation: form.currentDesignation,
    businessEmail: form.businessEmail,
  },
  personalInfo: {
    ...(base.personalInfo || {}),
    gender: form.gender,
    bloodGroup: form.bloodGroup,
    dateOfBirth: form.dob,
    personalEmailId: (base.personalInfo && base.personalInfo.personalEmailId) || form.businessEmail,
    alternateMobileNo: (base.personalInfo && base.personalInfo.alternateMobileNo) || "",
    address: (base.personalInfo && base.personalInfo.address) || "",
  },
  backgroundInfo: {
    ...(base.backgroundInfo || {}),
    referredBy: form.referredBy,
    previousJobInfo: form.previousJobInfo,
    backgroundCheckInfo: form.notes,
    resume: (base.backgroundInfo && base.backgroundInfo.resume) || "",
  },
  professionalInfo: {
    ...(base.professionalInfo || {}),
    educationalQualification: form.educationalQualification,
    languagesKnown: splitList(form.languageKnown),
    skills: splitList(form.skills),
    certificates: form.certifications
      ? splitList(form.certifications)
      : (base.professionalInfo && base.professionalInfo.certificates) || [],
  },
  personalityInfo: {
    ...(base.personalityInfo || {}),
    interests: splitList(form.interests),
    traits: splitList(form.traits),
  },
});

const validate = (form) => {
  const errors = {};
  const req = (k, msg) => {
    if (!String(form[k] || "").trim()) errors[k] = msg;
  };
  req("empId", "Employee Id is required");
  req("dateOfJoining", "Date of Joining is required");
  req("currentDesignation", "Current designation is required");
  req("businessEmail", "Business Email is required");
  if (form.businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.businessEmail))
    errors.businessEmail = "Enter a valid email";
  req("emergencyContact", "Emergency contact is required");
  if (form.emergencyContact && !/^[+\d][\d\s-]{6,}$/.test(form.emergencyContact))
    errors.emergencyContact = "Enter a valid phone";
  req("status", "Status is required");
  req("name", "Name is required");
  req("phoneNo", "Phone No is required");
  if (form.phoneNo && !/^[+\d][\d\s-]{6,}$/.test(form.phoneNo))
    errors.phoneNo = "Enter a valid phone";
  req("gender", "Gender is required");
  req("dob", "DOB is required");
  req("bloodGroup", "Blood Group is required");
  req("educationalQualification", "Educational qualification is required");
  req("languageKnown", "Language known is required");
  req("skills", "Skills are required");
  return errors;
};

const Field = ({ label, required, error, children }) => (
  <div className="w-full">
    <label className={LABEL}>
      {label}
      {required && REQUIRED}
    </label>
    {children}
    {error && <p className={ERROR_TXT}>{error}</p>}
  </div>
);

const UserForm = ({ mode = "add", initialValues, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(() => ({ ...emptyForm, ...(initialValues || {}) }));
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(addImage);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    const value = e && e.target ? e.target.value : e;
    setForm((f) => ({ ...f, [k]: value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onSubmit(form);
  };

  const inputCls = (field) =>
    `${INPUT} ${errors[field] ? "border-red-500" : "border-[#E0E0E0] !text-(--black)"}`;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  const fileInputRef2 = useRef(null);

  const handleButtonClick2 = () => {
    fileInputRef2.current?.click();
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected File:", file);
      // Upload or store the file here
    }
  };

  const INTEREST_OPTIONS = [
    { label: "Cricket", value: "Cricket" },
    { label: "Music", value: "Music" },
    { label: "Politics", value: "Politics" },
    { label: "Reading", value: "Reading" },
    { label: "Traveling", value: "Traveling" },
    { label: "Cooking", value: "Cooking" },
    { label: "Photography", value: "Photography" },
  ];

  const TRAIT_OPTIONS = [
    { label: "Patient", value: "Patient" },
    { label: "Diligent", value: "Diligent" },
    { label: "Friendly", value: "Friendly" },
    { label: "Honest", value: "Honest" },
    { label: "Leadership", value: "Leadership" },
    { label: "Creative", value: "Creative" },
    { label: "Team Player", value: "Team Player" },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Accordion title="Employee Info" defaultOpen className={SECTION_CARD}>
        <div className="flex">
          <div className="grid w-[80%] grid-cols-1 md:grid-cols-2 gap-x-[4rem] gap-y-[2.4rem] pt-[1.6rem]">
            <div data-field="empId">
              <Field label="Employee Id" required error={errors.empId}>
                <CustomInput
                  value={form.empId}
                  onChange={set("empId")}
                  placeholder="Enter your Employee id"
                  inputClassName={inputCls("empId")}
                />
              </Field>
            </div>
            <div data-field="dateOfJoining">
              <Field label="Date Of Joining" required error={errors.dateOfJoining}>
                <CustomDateInput
                  inputClassName="var(--black)"
                  value={form.dateOfJoining}
                  onChange={set("dateOfJoining")}
                  hasError={!!errors.dateOfJoining}
                  placeholder="dd/mm/yyyy"
                />
              </Field>
            </div>
            <div data-field="currentDesignation">
              <Field label="Current designation" required error={errors.currentDesignation}>
                <CustomInput
                  value={form.currentDesignation}
                  onChange={set("currentDesignation")}
                  placeholder="Enter your current designation"
                  inputClassName={inputCls("currentDesignation")}
                />
              </Field>
            </div>
            <div data-field="businessEmail">
              <Field label="Business Email" required error={errors.businessEmail}>
                <CustomInput
                  type="email"
                  value={form.businessEmail}
                  onChange={set("businessEmail")}
                  placeholder="Enter your business email"
                  inputClassName={inputCls("businessEmail")}
                />
              </Field>
            </div>
            <div data-field="emergencyContact">
              <Field label="Emergency Contact" required error={errors.emergencyContact}>
                <CustomInput
                  value={form.emergencyContact}
                  onChange={set("emergencyContact")}
                  placeholder="Enter your emergency contact"
                  inputClassName={inputCls("emergencyContact")}
                />
              </Field>
            </div>
            <div data-field="status">
              <Field label="Status" required error={errors.status}>
                <select value={form.status} onChange={set("status")} className={inputCls("status")}>
                  <option value="">Enter your status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className={`ml-auto mt-[3%] ${mode === "edit" ? "hidden" : "block"}`}>
            <div
              onClick={handleImageClick}
              className="relative w-[20rem] h-[20rem] rounded-[1.6rem] border border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-center ml-[4rem] cursor-pointer overflow-hidden"
            >
              <div className="w-full h-full">
                <CustomImage
                  src={selectedImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute bottom-[5px] right-[5px] w-[20px] h-[20px]">
                <CustomImage src={cameraIcon} alt="Camera" />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </Accordion>

      <Accordion title="Personal Info" defaultOpen className={SECTION_CARD}>
        <div className="grid grid-cols-1 w-[80%] md:grid-cols-2 gap-x-[4rem] gap-y-[2.4rem] pt-[1.6rem]">
          <div data-field="name">
            <Field label="Name" required error={errors.name}>
              <CustomInput
                value={form.name}
                onChange={set("name")}
                placeholder="Enter your name"
                inputClassName={inputCls("name")}
              />
            </Field>
          </div>
          <div data-field="phoneNo">
            <Field label="Phone No" required error={errors.phoneNo}>
              <CustomInput
                value={form.phoneNo}
                onChange={set("phoneNo")}
                placeholder="Enter your phone number"
                inputClassName={inputCls("phoneNo")}
              />
            </Field>
          </div>
          <div data-field="gender">
            <Field label="Gender" required error={errors.gender}>
              <select value={form.gender} onChange={set("gender")} className={inputCls("gender")}>
                <option value="">Enter your gender</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div data-field="dob">
            <Field label="DOB" required error={errors.dob}>
              <CustomDateInput
                value={form.dob}
                onChange={set("dob")}
                hasError={!!errors.dob}
                placeholder="dd/mm/yyyy"
              />
            </Field>
          </div>
          <div data-field="bloodGroup">
            <Field label="Blood Group" required error={errors.bloodGroup}>
              <CustomInput
                value={form.bloodGroup}
                onChange={set("bloodGroup")}
                placeholder="Enter your Blood Group"
                inputClassName={inputCls("bloodGroup")}
              />
            </Field>
          </div>
        </div>
        <div className="pt-[2.4rem]">
          <button
            type="button"
            onClick={handleButtonClick2}
            className="text-[#1486DF] text-[1.6rem] font-medium inline-flex items-center gap-[0.6rem]"
          >
            <span className="text-[2rem]">+</span> Add Id Proof
          </button>

          <input
            ref={fileInputRef2}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange2}
          />
        </div>
      </Accordion>

      <Accordion title="Background Info" defaultOpen className={SECTION_CARD}>
        <div className="grid w-[80%] grid-cols-1 gap-y-[2.4rem] pt-[1.6rem]">
          <Field label="Referred by" error={errors.referredBy}>
            <CustomInput
              value={form.referredBy}
              onChange={set("referredBy")}
              placeholder="Enter your referred by"
              inputClassName={inputCls("referredBy")}
            />
          </Field>
          <Field label="Previous Job Info (Notes)">
            <textarea
              value={form.previousJobInfo}
              onChange={set("previousJobInfo")}
              placeholder="Enter your Notes..."
              rows={3}
              className={`${INPUT} min-h-[8rem] border-[#E0E0E0]`}
            />
          </Field>
          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Enter your Notes..."
              rows={3}
              className={`${INPUT} min-h-[8rem] border-[#E0E0E0]`}
            />
          </Field>
          <div>
            <button
              type="button"
              onClick={handleButtonClick2}
              className="text-[#1486DF] text-[1.6rem] font-medium inline-flex items-center gap-[0.6rem]"
            >
              <span className="text-[2rem]">+</span> Attach Resume
            </button>

            <input
              ref={fileInputRef2}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange2}
            />
          </div>
        </div>
      </Accordion>

      {/* <Accordion title="Personality Info" defaultOpen className={SECTION_CARD}>
        <div className="grid grid-cols-1 w-[80%] md:grid-cols-2 gap-x-[4rem] gap-y-[2.4rem] pt-[1.6rem]">
          <Field label="Interests">
            <CustomInput
              value={form.interests}
              onChange={set("interests")}
              placeholder="e.g. Cricket, Music, Politics"
              inputClassName={inputCls("interests")}
            />
          </Field>
          <Field label="Traits">
            <CustomInput
              value={form.traits}
              onChange={set("traits")}
              placeholder="e.g. Patient, Diligent"
              inputClassName={inputCls("traits")}
            />
          </Field>
        </div>
      </Accordion> */}

      <Accordion title="Personality Info" defaultOpen className={SECTION_CARD}>
        <div className="grid grid-cols-1 w-[80%] md:grid-cols-2 gap-x-[4rem] gap-y-[2.4rem] pt-[1.6rem]">
          <Field label="Interests">
            <CustomDropdown
              name="interests"
              value={form.interests}
              onChange={set("interests")}
              options={INTEREST_OPTIONS}
              placeholder="Select Interest"
              selectClassName={inputCls("interests")}
            />
          </Field>

          <Field label="Traits">
            <CustomDropdown
              name="traits"
              value={form.traits}
              onChange={set("traits")}
              options={TRAIT_OPTIONS}
              placeholder="Select Trait"
              selectClassName={inputCls("traits")}
            />
          </Field>
        </div>
      </Accordion>

      <Accordion title="Professional Info" defaultOpen className={SECTION_CARD}>
        <div className="grid grid-cols-1 w-[80%] md:grid-cols-2 gap-x-[4rem] gap-y-[2.4rem] pt-[1.6rem]">
          <div data-field="educationalQualification">
            <Field
              label="Educational Qualification"
              required
              error={errors.educationalQualification}
            >
              <CustomInput
                value={form.educationalQualification}
                onChange={set("educationalQualification")}
                placeholder="Enter your educational qualification"
                inputClassName={inputCls("educationalQualification")}
              />
            </Field>
          </div>
          <div data-field="languageKnown">
            <Field label="Language Known" required error={errors.languageKnown}>
              <CustomInput
                value={form.languageKnown}
                onChange={set("languageKnown")}
                placeholder="e.g. Tamil, English"
                inputClassName={inputCls("languageKnown")}
              />
            </Field>
          </div>
          <Field label="Certifications">
            <CustomInput
              value={form.certifications}
              onChange={set("certifications")}
              placeholder="Enter your certifications"
              inputClassName={inputCls("certifications")}
            />
          </Field>
          <div data-field="skills">
            <Field label="Skills" required error={errors.skills}>
              <CustomInput
                value={form.skills}
                onChange={set("skills")}
                placeholder="e.g. Listening Music, Traveling"
                inputClassName={inputCls("skills")}
              />
            </Field>
          </div>
        </div>
        {/* <div className="pt-[2.4rem]">
          <button
            type="button"
            className="text-[#1486DF] text-[1.6rem] font-medium inline-flex items-center gap-[0.6rem]"
          >
            <span className="text-[2rem]">+</span> Add Certificate
          </button>
        </div> */}
      </Accordion>

      <div className="flex justify-end gap-[1.6rem] pt-[2.4rem] pb-[4rem]">
        <ButtonComponent
          type="button"
          onClick={onCancel}
          className="min-w-[13rem] rounded-[0.8rem] border border-[#1486DF] text-[#1486DF] text-[2.1rem] font-medium px-[8.4rem] py-[1.2rem] bg-white hover:bg-[#F5FAFF]"
        >
          Cancel
        </ButtonComponent>
        <ButtonComponent
          type="submit"
          disabled={submitting}
          className="min-w-[13rem] rounded-[0.8rem] bg-[#1486DF] text-white text-[2.1rem] font-medium px-[8.4rem] py-[1.2rem] hover:bg-[#0F6FBE] disabled:opacity-60"
        >
          {mode === "edit" ? "Save Changes" : "Add"}
        </ButtonComponent>
      </div>
    </form>
  );
};

export default UserForm;
