import { useRef } from "react";

const OTP_LENGTH = 6;

const OtpDigitsInput = ({ value, onChange, disabled, hasError }) => {
  const inputRefs = useRef([]);

  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] || "");

  const setDigit = (index, digit) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
  };

  const handleChange = (index, event) => {
    const raw = event.target.value.replace(/[^\d]/g, "");
    if (!raw) {
      setDigit(index, "");
      return;
    }

    const digit = raw[raw.length - 1];
    setDigit(index, digit);
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/[^\d]/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted.padEnd(OTP_LENGTH, "").slice(0, OTP_LENGTH).trimEnd());
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          aria-label={`OTP digit ${index + 1}`}
          className={`h-[6.6rem] w-[6.6rem] text-center text-[1.8rem] font-medium border outline-none focus:ring-2 rounded-md ${
            hasError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-200 bg-[#F0F4FF] focus:ring-blue"
          } disabled:opacity-50`}
        />
      ))}
    </div>
  );
};

export default OtpDigitsInput;
