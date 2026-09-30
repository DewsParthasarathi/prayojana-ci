import ReusableModal from "./ReusableModal";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  variant = "danger",
}) => {
  const confirmClasses =
    variant === "danger"
      ? "bg-[#FA0F19] hover:bg-[#D80D16] text-white"
      : "bg-[#006BBF] hover:bg-[#0F6FBE] text-white";

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title={title} width="50%">
      <p className="text-[2rem] text-[#333333] leading-[1.6] mb-[3rem]">{message}</p>

      <div className="flex justify-end gap-[1.2rem]">
        <button
          type="button"
          onClick={onClose}
          className="px-[2.4rem] py-[1rem] rounded-[0.8rem] text-[1.5rem] font-medium bg-[#F1F1F3] hover:bg-[#E3E3E5] text-[#1B1A1F] cursor-pointer transition"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`px-[2.4rem] py-[1rem] rounded-[0.8rem] text-[1.5rem] font-medium cursor-pointer transition ${confirmClasses}`}
        >
          {confirmLabel}
        </button>
      </div>
    </ReusableModal>
  );
};

export default ConfirmationModal;
