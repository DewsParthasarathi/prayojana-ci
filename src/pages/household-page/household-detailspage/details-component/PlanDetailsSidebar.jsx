import React, { useState } from "react";
import CustomImage from "@/components/image-component/CustomImage";
import editIcon from "@assets/images/detailspage-img/edit.png";
import deleteIcon from "@assets/images/detailspage-img/delete.png";
import relativeImg from "@assets/images/profile-images/relative-image.svg";
import crownImg from "@assets/images/profile-images/yellow-crown.svg";
import attachment1 from "@assets/images/profile-images/1.png";
import attachment2 from "@assets/images/profile-images/2.png";
import attachment3 from "@assets/images/profile-images/3.png";
import attachment4 from "@assets/images/profile-images/4.png";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { useHouseholdDetailRefresh } from "@/hooks/householdDetailRefreshContext";
import StatusChangeModal from "./StatusChangeModal";

const PlanDetailsSidebar = ({ household }) => {
  const [isActive, setIsActive] = useState(
    household?.planStatus === "active" || household?.planStatus === "Active",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { patch } = useFetch();
  const { showToast } = useToast();
  const { refreshHouseholdDetail } = useHouseholdDetailRefresh();

  const handleToggleClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  const targetStatus = isActive ? "paused" : "active";

  const handleConfirmStatusChange = async ({ date, reason }) => {
    if (!household?.id) {
      showToast({
        variant: "error",
        description: "Unable to update status. Household details are missing.",
      });
      return;
    }

    try {
      await patch(`http://localhost:4001/houseHoldData/${household.id}`, {
        planStatus: targetStatus,
        plan_status_date: date,
        plan_status_reason: reason,
      });

      await refreshHouseholdDetail();
      setIsActive(targetStatus === "active");

      showToast({
        variant: "success",
        description:
          targetStatus === "active"
            ? "Plan marked as active successfully."
            : "Plan paused successfully.",
      });
    } catch (err) {
      showToast({
        variant: "error",
        description: err.message || "Failed to update plan status.",
      });
      throw err;
    }
  };

  const sponsor = household?.relatives?.[0] || null;

  const attachments = [
    { id: 1, image: attachment1, label: "Document" },
    { id: 2, image: attachment2, label: "Medical Report" },
    { id: 3, image: attachment3, label: "Prescription" },
    { id: 4, image: attachment4, label: "Hospital Report" },
  ];

  return (
    <div className="w-full h-full flex flex-col p-[3rem] pb-[2rem] overflow-y-auto">
      <div className="flex items-center justify-between mb-[4rem] w-[25%] ml-auto">
        <span
          className={`text-[1.8rem] font-medium transition-colors ${
            !isActive ? "text-[#1B1A1F]" : "text-[#999]"
          }`}
        >
          Paused
        </span>

        <button
          type="button"
          onClick={handleToggleClick}
          aria-label={isActive ? "Switch plan to paused" : "Switch plan to active"}
          aria-pressed={isActive}
          className={`relative inline-flex h-[3.5rem] w-[6.5rem] items-center rounded-full transition-colors mx-[1.5rem] ${
            isActive ? "bg-[#22BE4E]" : "bg-[#CCC]"
          }`}
        >
          <span
            className={`inline-block h-[3rem] w-[3rem] transform rounded-full bg-white shadow transition-transform ${
              isActive ? "translate-x-[3rem]" : "translate-x-[0.25rem]"
            }`}
          />
        </button>

        <span
          className={`text-[1.8rem] font-medium transition-colors ${
            isActive ? "text-[#1B1A1F]" : "text-[#999]"
          }`}
        >
          Active
        </span>
      </div>

      <StatusChangeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        targetStatus={targetStatus}
        onConfirm={handleConfirmStatusChange}
      />

      {/* Plan Type & Status */}
      <div className="mb-[4rem]">
        <div className="flex items-center gap-[1.5rem] mb-[2rem]">
          <div className="rounded-[1rem] flex items-center justify-center">
            <span className="text-white text-[3rem] font-bold inline-block h-[10rem] w-[10rem] ">
              <CustomImage src={crownImg} />
            </span>
          </div>
          <div>
            <h3 className="text-[2.8rem] font-semibold text-[#000]">
              {household?.plan_type || "Essential"}
            </h3>
            <p
              className={`text-[2.6rem] font-medium ${isActive ? "text-[#22BE4E]" : "text-[#999]"}`}
            >
              {isActive ? "● Active" : "● Paused"}
            </p>
          </div>
        </div>
        <p className="text-[1.4rem] text-[#666]">
          Valid Till: <span className="font-semibold">{household?.valid_till || "-"}</span>
        </p>
      </div>

      {sponsor && (
        <div className="mb-[4rem]">
          <h4 className="text-[1.8rem] font-semibold mb-[1.5rem]">Sponsor</h4>
          <div className="flex items-center gap-[2rem]  p-[1.5rem] rounded-[0.8rem]">
            <div className="">
              <CustomImage src={relativeImg} />
            </div>
            <div className="flex-1">
              <p className="text-[3rem] font-semibold text-(--black)">{sponsor.name}</p>
              <p className="text-[1.8rem] text-[#666]">{sponsor.relation || "Relative"}</p>
              <p className="text-[1.8rem] text-[#1287E3] font-semibold mt-[0.5rem]">
                {sponsor.mobile_number}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-[2.6rem] font-semibold mb-[1.5rem]">Common Attachments</h4>
        <div className="flex gap-[3.5rem]">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex flex-col  gap-[0.8rem]">
              <div className="w-[14.6rem] h-[15.3rem] rounded-[0.8rem] overflow-hidden border border-[#e0e0e0] bg-[#f5f5f5]">
                <CustomImage src={attachment.image} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsSidebar;
