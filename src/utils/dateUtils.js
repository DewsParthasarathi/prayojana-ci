/**
 * Calculates a person's age (in completed years) from their date of birth,
 * relative to the current date.
 *
 * @param {string | Date | null | undefined} dateOfBirth - ISO date string (e.g. "1971-06-15") or a Date instance.
 * @returns {number | null} The age in completed years, or null if the date is missing/invalid.
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;

  const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);

  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age < 0 ? 0 : age;
};
