import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CustomImage from "../image-component/CustomImage";
import closeImg from "@assets/images/create-image/close-icon.png";
const ANIMATION_DURATION = 300;

const ReusableSidebar = ({ isOpen, onClose, title, children }) => {
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
      className="fixed inset-0 z-[1000] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-[#000000] transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-70" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        onMouseDown={(event) => event.stopPropagation()}
        className={`relative h-full px-[7.8rem] w-full sm:w-[63%] sm:min-w-[45rem] sm:max-w-[66%] bg-white shadow-[-0.8rem_0_2.4rem_rgba(0,0,0,0.08)] flex flex-col transition-transform duration-300 ease-in-out will-change-transform ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between  pt-[2.8rem] pb-[2rem] shrink-0">
          <h2 className="text-[3.2rem] font-bold text-[#1B1A1F]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-[3.6rem] h-[3.6rem] flex items-center justify-center rounded-full text-[#1B1A1F] hover:bg-[#F5F5F5] transition"
          >
            <CustomImage src={closeImg} alt="close image" />
          </button>
        </div>

        <div className="border-b border-[#EDEDED] shrink-0" />

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default ReusableSidebar;
