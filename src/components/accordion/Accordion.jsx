import { useState } from "react";
import CustomImage from "../image-component/CustomImage";
import downArrow from "@assets/images/customer-img/down-arrow.png";

const Accordion = ({
  title,
  children,
  defaultOpen = false,
  open: openProp,
  onToggle,
  className = "",
  titleActions,

  fillRemaining = false,
}) => {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? openProp : internalOpen;

  const toggle = () => {
    if (isControlled) {
      onToggle?.(!isOpen);
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={`rounded-xl w-full flex flex-col overflow-hidden ${
        fillRemaining
          ? `transition-[flex] duration-300 ease-in-out ${isOpen ? "flex-1 min-h-0" : "flex-none"}`
          : ""
      } ${className}`}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 transition relative shrink-0 bg-[#fff]">
        <button
          type="button"
          onClick={toggle}
          className="flex-1 flex items-center justify-between text-left"
        >
          <h3 className="text-[2.4rem] font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center gap-[1rem]">
            <div>
              <CustomImage
                src={downArrow}
                size={20}
                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </button>

        {titleActions ? (
          <div
            className="ml-[1.5rem] flex items-center absolute right-[5%] z-1"
            onClick={(event) => event.stopPropagation()}
          >
            {titleActions}
          </div>
        ) : null}
      </div>

      {/* Body */}
      {fillRemaining ? (
        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? "flex-1 min-h-0 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className={`px-5 pb-5 ${isOpen ? "h-full overflow-y-auto" : "overflow-hidden"}`}>
            {children}
          </div>
        </div>
      ) : (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-5 pb-5">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
