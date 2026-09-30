import { useState } from "react";
import CardComponent from "@/components/card-component/CardComponent";
import editIcon from "@assets/images/detailspage-img/edit.png";
import deleteIcon from "@assets/images/detailspage-img/delete.png";
import CustomImage from "@/components/image-component/CustomImage";
import HelperDetailsForm from "./HelperDetailsForm";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/ConfirmContext.jsx";
import { useHouseholdDetailRefresh } from "@/hooks/householdDetailRefreshContext";
import addIcon from "@assets/images/household-images/add-icon.png";

const HelperDetailsSidebar = ({ household }) => {
  const helpers = household?.helpers || [];
  const [mode, setMode] = useState("list"); // "list", "add", "edit"
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [selectedHelperIndex, setSelectedHelperIndex] = useState(null);

  const { patch } = useFetch();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const { refreshHouseholdDetail } = useHouseholdDetailRefresh();

  const handleAddClick = () => {
    setMode("add");
    setSelectedHelper(null);
    setSelectedHelperIndex(null);
  };

  const handleEditClick = (helper, index) => (event) => {
    event.stopPropagation();
    setMode("edit");
    setSelectedHelper(helper);
    setSelectedHelperIndex(index);
  };

  const handleDeleteClick = (helperIndex) => async (event) => {
    event.stopPropagation();
    const ok = await confirm({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this helper? This action cannot be undone.",
    });
    if (!ok) return;

    try {
      const updatedHelpers = helpers.filter(
        (_, index) => index !== helperIndex,
      );
      await patch(`http://localhost:4001/houseHoldData/${household.id}`, {
        helpers: updatedHelpers,
      });

      await refreshHouseholdDetail();
      showToast({
        variant: "success",
        description: "Helper deleted successfully.",
      });
    } catch (err) {
      showToast({
        variant: "error",
        description: err.message || "Failed to delete helper.",
      });
    }
  };

  const handleFormClose = () => {
    setMode("list");
    setSelectedHelper(null);
    setSelectedHelperIndex(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
  };

  if (mode === "add" || mode === "edit") {
    return (
      <HelperDetailsForm
        key={selectedHelperIndex ?? "new-helper"}
        household={household}
        helper={selectedHelper}
        helperIndex={selectedHelperIndex}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-[3rem] pb-[2rem] overflow-y-auto relative">
      <h3 className="text-[2.2rem] font-semibold mb-[2rem]">Helper Details</h3>

      {helpers.length > 0 ? (
        <div className="grid grid-cols-3 gap-[2rem] pb-[8rem]">
          {helpers.map((helper, index) => {
            const firstLetter = helper.name?.charAt(0)?.toUpperCase() || "?";

            return (
              <CardComponent
                key={`helper-${index}`}
                image={helper.image}
                name={helper.name}
                subTitle={helper.services}
                lastData={helper.mobile_number}
                firstLetter={firstLetter}
                headingClassName="text-[#000000]"
                subTitleClassName="text-[#333333]"
                lastDataClassName="text-[#1287E3]"
                className="cursor-pointer transition-shadow hover:shadow-lg"
              >
                {/* Edit Button */}
                <button
                  onClick={handleEditClick(helper, index)}
                  className="w-[5rem] h-[5rem] flex items-center justify-center bg-[#E8F4FE] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-md"
                  type="button"
                  aria-label="Edit helper"
                >
                  <div className="w-[2rem] h-[2rem]">
                    <CustomImage src={editIcon} alt="edit" />
                  </div>
                </button>

                {/* Delete Button */}
                <button
                  onClick={handleDeleteClick(index)}
                  className="w-[5rem] h-[5rem] flex items-center justify-center bg-[#FFE7E9] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-md"
                  type="button"
                  aria-label="Delete helper"
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
          <p className="text-[1.8rem] text-[#999]">No helpers assigned</p>
        </div>
      )}

      {/* Floating Add Button */}
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

export default HelperDetailsSidebar;
