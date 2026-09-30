import CustomImage from "@/components/image-component/CustomImage";
import editIcon from "@assets/images/detailspage-img/edit.png";
import deleteIcon from "@assets/images/detailspage-img/delete.png";

const AccordionItemRow = ({ title, timeRange, onEdit, onDelete, isLast }) => {
  return (
    <div
      className={`flex items-center justify-between py-[1.6rem] ${!isLast ? "border-b border-[#EFEFEF]" : ""}`}
    >
      <div>
        <p className="text-[1.6rem] font-semibold text-[#1B1A1F]">{title}</p>
        <p className="mt-[0.4rem] text-[1.3rem] text-[#8A8A8A]">{timeRange}</p>
      </div>

      <div className="flex items-center gap-[0.8rem]">
        <button
          type="button"
          onClick={onEdit}
          aria-label="edit"
          className="w-[3.6rem] h-[3.6rem] rounded-[0.8rem] bg-[#EBF0F5] flex items-center justify-center transition-transform duration-200 hover:scale-105"
        >
          <div className="w-[1.6rem] h-[1.6rem]">
            <CustomImage src={editIcon} alt="Edit" />
          </div>
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="delete"
          className="w-[3.6rem] h-[3.6rem] rounded-[0.8rem] bg-[#FDEBEC] flex items-center justify-center transition-transform duration-200 hover:scale-105"
        >
          <div className="w-[1.6rem] h-[1.6rem]">
            <CustomImage src={deleteIcon} alt="Delete" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default AccordionItemRow;
