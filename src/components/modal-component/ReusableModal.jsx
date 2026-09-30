import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CustomImage from "../image-component/CustomImage";
import closeImg from "@assets/images/create-image/close-icon.png";

const ANIMATION_DURATION = 200;

const ReusableModal = ({ isOpen, onClose, title, children, width = "52rem" }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef(null);
  const frameRef = useRef(null);

  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }
  if (!isOpen && isVisible) {
    setIsVisible(false);
  }

  useEffect(() => {
    if (isOpen || !shouldRender) return undefined;

    const closeTimeoutId = setTimeout(() => {
      setShouldRender(false);
    }, ANIMATION_DURATION);

    return () => clearTimeout(closeTimeoutId);
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (shouldRender) {
      frameRef.current = requestAnimationFrame(() => setIsVisible(true));
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shouldRender, onClose]);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const handleBackdropMouseDown = (event) => {
    if (panelRef.current && !panelRef.current.contains(event.target)) {
      onClose?.();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-[#000000] transition-opacity duration-200 ease-in-out ${
          isVisible ? "opacity-50" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        onMouseDown={(event) => event.stopPropagation()}
        style={{ width }}
        className={`relative max-w-[92%] max-h-[88vh] overflow-y-auto bg-white rounded-[1.2rem] shadow-[0_0.8rem_3.2rem_rgba(0,0,0,0.16)] px-[3.2rem] py-[2.8rem] transition-all duration-200 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between mb-[2rem]">
          <h2 className="text-[2.2rem] font-semibold text-[#1B1A1F]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-[3.2rem] h-[3.2rem] flex items-center justify-center rounded-full text-[#1B1A1F] hover:bg-[#F5F5F5] transition"
          >
            <CustomImage src={closeImg} alt="close" />
          </button>
        </div>

        <div className="border-b border-[#EDEDED] mb-[2.4rem]" />

        {children}
      </div>
    </div>,
    document.body,
  );
};

export default ReusableModal;
