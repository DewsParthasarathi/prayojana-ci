import { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { otpRequested } from "../../store/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "@hooks/useToast";
import { ROUTES } from "@/routes/routes";
import indiaFlag from "@assets/images/login-images/india-flag.png";
import downArrow from "@assets/images/login-images/down-arrow.png";
import { normalizeMobileNumber, getMobileNumberError } from "@/utils/validators";
import { requestOtp } from "@/services/otpService";
import prayojanaLogo from "@assets/images/login-images/prayojana-logo.png";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || ROUTES.HOUSEHOLD;
    return <Navigate to={redirectTo} replace />;
  }

  const handleMobileChange = (event) => {
    const normalized = normalizeMobileNumber(event.target.value);
    setMobile(normalized);
    if (touched) {
      setError(getMobileNumberError(normalized));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(getMobileNumberError(mobile));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = getMobileNumberError(mobile);
    setTouched(true);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!acceptedTerms) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { otp } = await requestOtp(mobile);

      dispatch(otpRequested(mobile));

      showToast({
        variant: "success",
        title: "OTP Sent",
        description: `Your OTP is ${otp}`,
      });

      navigate(ROUTES.OTP_VERIFICATION, {
        state: { from: location.state?.from },
      });
    } catch {
      setError("Could not send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = Boolean(mobile) && acceptedTerms && !isSubmitting;

  return (
    <div className="login-form-container h-full w-full bg-white">
      <form onSubmit={handleSubmit} noValidate className="w-[80%] m-auto pt-[8%] pb-[12%]">
        <div className="logo-wrapper flex justify-center mb-[6%] w-[30%] mx-auto">
          <img src={prayojanaLogo} alt="Prayojana" className="h-10" />
        </div>

        <div className="form-headers pb-[8%] text-center">
          <h1 className="mb-2 font-sans text-[4.6rem] font-semibold text-primary">
            Login to your account
          </h1>
          <p className="text-login-subhead text-[2rem]">
            Personalized Elder Care That Feels Like Family
          </p>
        </div>

        <label htmlFor="mobile" className="relative flex items-stretch mb-1 w-[70%] mx-auto">
          <div
            className={`flex items-center gap-1 border border-r-0 px-3 text-sm text-label-gray  shrink-0 relative after:content-[''] after:absolute after:right-0  after:h-[70%] after:w-[1.5px] after:bg-gray-300
              
              ${error ? "border-red-500" : "border-gray-300"}`}
          >
            <div className="india-flag-wrapper">
              <img src={indiaFlag} alt="india flag" />
            </div>
            <p className="flex items-center text-[1.8rem] gap-[5px]">
              +91{" "}
              <span className="w-[10px] h-[10px]">
                <img src={downArrow} alt="down arrow" />
              </span>{" "}
            </p>
          </div>

          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            placeholder="Phone"
            value={mobile}
            onChange={handleMobileChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "mobile-error" : undefined}
            className={`w-full border px-3 py-[1.5rem] outline-none border-l-0 text-[1.8rem]  ${
              error ? "border-red-500  border-l-0" : "border-gray-300 "
            }`}
          />
        </label>

        <div className=" min-h-[1.25rem] my-[1.2rem]">
          {error && (
            <p id="mobile-error" className="text-[12px] text-red-500 text-center">
              {error}
            </p>
          )}
        </div>

        <label className="flex items-start w-[70%] mx-auto gap-2 justify-start mb-[6%] text-[1.4rem] text-login-subhead cursor-pointer select-none">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-0.5"
          />
          <span className="text-[12px]">
            By clicking on Login, I accept the{" "}
            <a href="#" className="underline">
              Terms &amp; Conditions
            </a>{" "}
            &amp;{" "}
            <a href="#" className="underline ">
              Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-[70%] flex justify-center mx-auto bg-blue mt-[8%] px-4 py-[2.5%] rounded-[6px]  font-medium text-[2.1rem] text-white transition-all duration-300 hover:scale-105 focus:outline-none disabled:opacity-50 disabled:hover:scale-100 "
        >
          {isSubmitting ? "Sending OTP..." : "LOG IN"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
