import { useState } from "react";
import CardComponent from "@/components/card-component/CardComponent";
import editIcon from "@assets/images/detailspage-img/edit.png";
import deleteIcon from "@assets/images/detailspage-img/delete.png";
import CustomImage from "@/components/image-component/CustomImage";
import RelativesForm from "./RelativesForm";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/ConfirmContext.jsx";
import { useHouseholdDetailRefresh } from "@/hooks/householdDetailRefreshContext";
import addIcon from "@assets/images/household-images/add-icon.png";
const RelativesSidebar = ({ household }) => {
  const relatives = household?.relatives || [];
  const [mode, setMode] = useState("list");
  const [selectedRelative, setSelectedRelative] = useState(null);
  const [selectedRelativeIndex, setSelectedRelativeIndex] = useState(null);

  const { patch } = useFetch();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const { refreshHouseholdDetail } = useHouseholdDetailRefresh();

  const handleAddClick = () => {
    setMode("add");
    setSelectedRelative(null);
    setSelectedRelativeIndex(null);
  };

  const handleEditClick = (relative, index) => (event) => {
    event.stopPropagation();
    setMode("edit");
    setSelectedRelative(relative);
    setSelectedRelativeIndex(index);
  };

  const handleDeleteClick = (relativeIndex) => async (event) => {
    event.stopPropagation();
    const ok = await confirm({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this relative? This action cannot be undone.",
    });
    if (!ok) return;

    try {
      const updatedRelatives = relatives.filter((_, index) => index !== relativeIndex);
      await patch(`http://localhost:4001/houseHoldData/${household.id}`, {
        relatives: updatedRelatives,
      });

      await refreshHouseholdDetail();
      showToast({
        variant: "success",
        description: "Relative deleted successfully.",
      });
    } catch (err) {
      showToast({
        variant: "error",
        description: err.message || "Failed to delete relative.",
      });
    }
  };

  const handleFormClose = () => {
    setMode("list");
    setSelectedRelative(null);
    setSelectedRelativeIndex(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
  };

  if (mode === "add" || mode === "edit") {
    return (
      <RelativesForm
        key={selectedRelativeIndex ?? "new-relative"}
        household={household}
        relative={selectedRelative}
        relativeIndex={selectedRelativeIndex}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-[3rem] pb-[2rem] overflow-y-auto relative">
      <h3 className="text-[2.2rem] font-semibold mb-[2rem]">Relatives</h3>

      {relatives.length > 0 ? (
        <div className="grid grid-cols-3 gap-[2rem] pb-[8rem]">
          {relatives.map((relative, index) => {
            const firstLetter = relative.name?.charAt(0)?.toUpperCase() || "?";

            return (
              <CardComponent
                key={`relative-${index}`}
                image={relative.image}
                name={relative.name}
                subTitle={relative.relation}
                lastData={relative.mobile_number}
                firstLetter={firstLetter}
                headingClassName="text-[#000000]"
                subTitleClassName="text-[#333333]"
                lastDataClassName="text-[#1287E3]"
                className="cursor-pointer transition-shadow hover:shadow-lg"
              >
                <button
                  onClick={handleEditClick(relative, index)}
                  className="w-[5rem] h-[5rem] flex items-center justify-center bg-[#E8F4FE] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-md"
                  type="button"
                  aria-label="Edit relative"
                >
                  <div className="w-[2rem] h-[2rem]">
                    <CustomImage src={editIcon} alt="edit" />
                  </div>
                </button>

                <button
                  onClick={handleDeleteClick(index)}
                  className="w-[5rem] h-[5rem] flex items-center justify-center bg-[#FFE7E9] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-md"
                  type="button"
                  aria-label="Delete relative"
                >
                  <div className="w-[2rem] h-[2rem]">
                    <CustomImage src={deleteIcon} alt="delete" />
                  </div>
                </button>
              </CardComponent>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[30rem]">
          <p className="text-[1.8rem] text-[#999]">No relatives assigned</p>
        </div>
      )}

      <button
        onClick={handleAddClick}
        className="absolute bottom-[3rem] right-[3rem] w-[7.4rem] h-[7.4rem]  rounded-full transition-all   z-10"
        aria-label="Add new helper"
      >
        <CustomImage src={addIcon} alt="add" />
      </button>
    </div>
  );
};

export default RelativesSidebar;
