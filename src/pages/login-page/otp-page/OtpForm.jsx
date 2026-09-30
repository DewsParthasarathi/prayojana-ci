import { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginSuccess, clearPendingMobile } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@hooks/useToast";
import { useCountdown } from "@/hooks/useCountdown";
import { ROUTES } from "@/routes/routes";
import { verifyOtp, resendOtp } from "@/services/otpService";
import OtpDigitsInput from "./OtpDigitsInput";
import prayojanaLogo from "@assets/images/login-images/prayojana-logo.png";

const RESEND_COOLDOWN_SECONDS = 30;

const OtpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, pendingMobile } = useAuth();
  const { showToast } = useToast();
  const { remaining, isRunning, start } = useCountdown(RESEND_COOLDOWN_SECONDS);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || ROUTES.HOUSEHOLD;
    return <Navigate to={redirectTo} replace />;
  }

  const handleOtpChange = (next) => {
    setOtp(next);
    if (error) setError("");
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (otp.length < 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOtp(pendingMobile, otp);

      dispatch(
        loginSuccess({
          mobile: pendingMobile,
          name: `User ${pendingMobile.slice(-4)}`,
        }),
      );

      const redirectTo = location.state?.from?.pathname || ROUTES.HOUSEHOLD;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setOtp("");
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (isRunning || isResending) return;
    setIsResending(true);
    setError("");
    try {
      const { otp: newOtp } = await resendOtp(pendingMobile);
      showToast({
        variant: "success",
        title: "OTP Resent",
        description: `Your OTP is ${newOtp}`,
      });
      start();
    } catch {
      setError("Could not resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleChangeNumber = () => {
    dispatch(clearPendingMobile());
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="otp-form-container h-full w-full bg-white">
      <form
        onSubmit={handleVerify}
        noValidate
        className="w-[80%] m-auto pt-[8%] pb-[12%]"
      >
        <div className="logo-wrapper flex justify-center mb-[6%] w-[30%] mx-auto">
          <img src={prayojanaLogo} alt="Prayojana" className="h-10" />
        </div>

        <div className="form-headers pb-[8%] text-center">
          <h1 className="mb-2 font-sans text-[4.6rem] font-semibold text-primary">
            OTP Verification
          </h1>
          <p className="text-login-subhead text-[2rem]">
            Check text messages for your OTP
          </p>
        </div>

        <OtpDigitsInput
          value={otp}
          onChange={handleOtpChange}
          disabled={isVerifying}
          hasError={Boolean(error)}
        />

        <div className="my-3 min-h-[1.25rem] text-center">
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="text-center text-[1.6rem] text-login-subhead pb-[4%]">
          Not received OTP?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isRunning || isResending}
            className="font-semibold text-blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning
              ? `RESEND IN ${remaining}S`
              : isResending
                ? "RESENDING..."
                : "RESEND NOW"}
          </button>
        </div>

        <button
          type="submit"
          disabled={isVerifying || otp.length < 6}
          className="w-[70%] mx-auto flex justify-center bg-blue py-[2.5%] rounded-[6px]  text-[2rem] font-medium text-white transition-all duration-300 hover:scale-105 focus:outline-none disabled:opacity-50 disabled:hover:scale-100"
        >
          {isVerifying ? "Verifying..." : "VERIFY OTP"}
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
