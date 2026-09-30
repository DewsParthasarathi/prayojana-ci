const MOBILE_REGEX = /^[6-9]\d{9}$/;

export const normalizeMobileNumber = (value = "") => {
  const digitsOnly = value.replace(/[^\d]/g, "");
  if (digitsOnly.length > 10) {
    return digitsOnly.slice(-10);
  }
  return digitsOnly;
};

export const isValidMobileNumber = (value = "") =>
  MOBILE_REGEX.test(normalizeMobileNumber(value));

export const getMobileNumberError = (value = "") => {
  const normalized = normalizeMobileNumber(value);
  if (!normalized) {
    return "Mobile number is required";
  }
  if (normalized.length < 10) {
    return "Mobile number must be 10 digits";
  }
  if (!MOBILE_REGEX.test(normalized)) {
    return "Enter a valid mobile number";
  }
  return "";
};
