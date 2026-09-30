import { useEffect, useRef, useState } from "react";
import ReusableModal from "@/components/modal-component/ReusableModal";
import ButtonComponent from "@/components/button-component/ButtonComponent";
import { Plus, X } from "lucide-react";
import attachment1 from "@assets/images/profile-images/1.png";
import attachment2 from "@assets/images/profile-images/2.png";
import attachment3 from "@assets/images/profile-images/3.png";
import attachment4 from "@assets/images/profile-images/4.png";
const AttachmentModal = ({ isOpen, onClose, initialFiles = [], onSave }) => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const customAttachments = [
    { name: "Medical Prescription 1", url: attachment1, isImage: true },
    { name: "Medical Prescription 2", url: attachment2, isImage: true },
    { name: "Medical Prescription 3", url: attachment3, isImage: true },
    { name: "Medical Prescription 4", url: attachment4, isImage: true },
  ];

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line renders
      setFiles(Array.isArray(initialFiles) ? initialFiles : []);
    }
  }, [isOpen, initialFiles]);

  const handleAdd = (event) => {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;

    const mapped = selected.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      isImage: file.type.startsWith("image/"),
    }));

    setFiles((prev) => [...prev, ...mapped]);
    event.target.value = "";
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave?.(files);
    onClose?.();
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Attachments" width="70rem">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={handleAdd}
        className="hidden"
      />

      <div className="grid grid-cols-3 gap-[2rem]">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="relative group w-full h-[14rem] rounded-[1rem] overflow-hidden border border-[#E0E0E0] bg-[#F7F7F7] flex items-center justify-center"
          >
            {file.isImage ||
            (typeof file === "string" && file.match(/\.(png|jpe?g|webp|gif)$/i)) ? (
              <img
                src={customAttachments[index]?.url}
                alt={file.name || "attachment"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="px-[1rem] text-[1.3rem] text-center break-all text-[#666]">
                {file.name || file}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute z-10 top-[0.6rem] right-[0.6rem] w-[2.6rem] h-[2.6rem] rounded-full bg-black/60 text-white flex items-center justify-center"
              aria-label="remove"
            >
              <X className="w-[1.6rem] h-[1.6rem]" />
            </button>

            <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-white text-[2rem] font-medium text-center px-2">
                {`${customAttachments[index]?.name}  `}
              </span>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-[14rem] rounded-[1rem] border-2 border-dashed border-[#9CC7EC] bg-[#F6FAFE] flex items-center justify-center"
          aria-label="add attachment"
        >
          <Plus className="w-[3rem] h-[3rem] text-[#006BBF]" />
        </button>
      </div>

      <div className="flex justify-end gap-[1.6rem] mt-[2.8rem]">
        <ButtonComponent
          type="button"
          onClick={onClose}
          className="px-[3.2rem] py-[1.1rem] rounded-[0.8rem] border border-[#006BBF] text-[#006BBF] text-[1.8rem] font-semibold"
        >
          Cancel
        </ButtonComponent>
        <ButtonComponent
          type="button"
          onClick={handleSave}
          className="px-[3.2rem] py-[1.1rem] rounded-[0.8rem] bg-[#006BBF] text-white text-[1.8rem] font-semibold hover:bg-[#0F85E2] transition"
        >
          Done
        </ButtonComponent>
      </div>
    </ReusableModal>
  );
};

export default AttachmentModal;
