import { useEffect, useState } from "react";
import ReusableModal from "@/components/modal-component/ReusableModal";
import ButtonComponent from "@/components/button-component/ButtonComponent";

const NotesModal = ({ isOpen, onClose, initialNotes = "", onSave }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line renders
      setValue(typeof initialNotes === "string" ? initialNotes : "");
    }
  }, [isOpen, initialNotes]);

  const handleSave = () => {
    onSave?.(value.trim());
    onClose?.();
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Notes" width="90rem">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter your Notes..."
        className="w-full h-[36rem] rounded-[1rem] border border-[#E0E0E0] p-[2rem] text-[1.6rem] text-[#1B1A1F] placeholder:text-[#A4A4A4] focus:outline-none focus:border-[#006BBF] resize-none"
      />
      <div className="flex justify-end mt-[2.4rem]">
        <ButtonComponent
          type="button"
          onClick={handleSave}
          className="px-[3.2rem] py-[1.2rem] rounded-[0.8rem] bg-[#006BBF] text-white text-[1.8rem] font-semibold hover:bg-[#0F85E2] transition"
        >
          Save Changes
        </ButtonComponent>
      </div>
    </ReusableModal>
  );
};

export default NotesModal;
