import { useState } from "react";
import planDetailsIcon from "@assets/images/logos/plan-details.svg";
import helperDetails from "@assets/images/logos/helper-details.svg";
import relativies from "@assets/images/logos/relativies.svg";
import intractions from "@assets/images/logos/intractions.svg";
import tasks from "@assets/images/logos/tasks.svg";
import planHistory from "@assets/images/logos/plan-histry.svg";
import paymentHistory from "@assets/images/logos/payment-history.svg";
import CustomImage from "@/components/image-component/CustomImage";
import location from "@assets/images/logos/location.svg";
import emergency from "@assets/images/logos/emergency.svg";
import validTill from "@assets/images/logos/validtill.svg";
import mobile from "@assets/images/logos/phone.svg";
import telephone from "@assets/images/logos/telephone.svg";
import ReusableSidebar from "@/components/sidebar-drawer/ReusableSidebar";
import PlanDetailsSidebar from "./PlanDetailsSidebar";
import HelperDetailsSidebar from "./HelperDetailsSidebar";
import RelativesSidebar from "./RelativesSidebar";
import { useNavigate } from "react-router-dom";
import { DETAILS_OPTION_TO_VIEW } from "@/config/householdViewConfig";

const PlanContactDetails = ({ household }) => {
  const [sidebarState, setSidebarState] = useState({
    isOpen: false,
    type: null,
    item: null,
    itemIndex: undefined,
  });

  const navigate = useNavigate();

  const handleCloseSidebar = () => {
    setSidebarState({
      isOpen: false,
      type: null,
      item: null,
      itemIndex: undefined,
    });
  };
  const result = household;

  const planDetails = [
    {
      id: 1,
      name: "Plan Details",
      img: planDetailsIcon,
    },
    {
      id: 2,
      name: "Helper Details",
      img: helperDetails,
    },
    {
      id: 3,
      name: "Relatives",
      img: relativies,
    },
    {
      id: 4,
      name: "Interactions",
      img: intractions,
    },
    {
      id: 5,
      name: "Tasks",
      img: tasks,
    },
    {
      id: 6,
      name: "Plan History",
      img: planHistory,
    },
    {
      id: 7,
      name: "Payment History",
      img: paymentHistory,
    },
  ];

  const handleOpenAdd = (type) => (event) => {
    event.stopPropagation();
    setSidebarState({ isOpen: true, type, item: null, itemIndex: undefined });
  };

  const handleopenPage = (type) => (event) => {
    event.stopPropagation();
    const viewType = DETAILS_OPTION_TO_VIEW[type];
    navigate("/household", {
      state: { viewType, household },
    });
  };

  return (
    <div className="p-[2%] bg-[#fff] rounded-[16px]">
      <div className="plan-details flex gap-[11.5rem] border-b border-[#000000] pb-[3.6rem]">
        {planDetails.map((item) => (
          <div
            onClick={
              item.name == "Plan Details" ||
              item.name == "Helper Details" ||
              item.name == "Relatives"
                ? handleOpenAdd(item.name)
                : handleopenPage(item.name)
            }
            key={item.id}
            className="flex flex-col items-center gap-[0.4rem]"
          >
            <div className="w-[6.9rem] h-[6.9rem] z-1 bg-[#d9d9d9] rounded-full flex items-center justify-center relative overflow-hidden cursor-pointer after:content-['']   after:absolute after:bottom-0 after:left-0 after:w-full after:h-full after:rounded-full after:bg-[#00000070] after:translate-y-full after:transition-transform after:duration-300 after:z-0 hover:after:translate-y-0">
              <div className="w-[2.7rem]">
                <CustomImage src={item.img} alt={item.name} />
              </div>
            </div>
            <p className="text-[1.6rem]">{item.name}</p>
          </div>
        ))}
      </div>

      <div className="primary-details pt-[3.6rem]">
        <h2 className="text-[2.6rem] font-semibold">Contact Info</h2>

        <ul className="primary-details-container flex justify-between gap-[1%] mt-[3rem]">
          <div className="address flex gap-[1.1rem] w-[25%]">
            <div className="icon-container">
              <CustomImage src={location} />
            </div>
            <div>
              <p className="label text-[1.4rem] text-label-gray">Address</p>
              <p className="text-[1.9rem] w-[80%]">{result?.son_contact?.address || "-"}</p>
            </div>
          </div>
          <div className="emergency-number flex gap-[1.1rem] w-[18%]">
            <div className="icon-container">
              <CustomImage src={emergency} />
            </div>
            <div>
              <p className="label text-[1.4rem] text-label-gray">Emergency No</p>
              <p className="text-[1.9rem] text-[#FA0F19] font-semibold">
                {result?.son_contact?.emergency_number || "-"}
              </p>
            </div>
          </div>

          <div className="valid-date flex gap-[1.1rem] w-[18%]">
            <div className="icon-container">
              <CustomImage src={validTill} />
            </div>
            <div>
              <p className="label text-[1.4rem] text-label-gray">Valid Till</p>
              <p className="text-[1.9rem]">{result?.valid_till || "-"}</p>
            </div>
          </div>

          <div className="mobile-number flex gap-[1.1rem] w-[18%]">
            <div className="icon-container">
              <CustomImage src={mobile} />
            </div>
            <div>
              <p className="label text-[1.4rem] text-label-gray">Mobile No</p>
              <p className="text-[1.9rem]">{result?.son_contact?.contact_number || "-"}</p>
            </div>
          </div>

          <div className="landline-number flex gap-[1.1rem] w-[18%]">
            <div className="icon-container">
              <CustomImage src={telephone} />
            </div>
            <div>
              <p className="label text-[1.4rem] text-label-gray">Landline No</p>
              <p className="text-[1.9rem]">
                {result?.elders
                  .slice(0, 1)
                  ?.map((elder) => elder.telephone_number)
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </div>
          </div>
        </ul>
      </div>
      <ReusableSidebar
        isOpen={sidebarState.isOpen}
        onClose={handleCloseSidebar}
        title={
          sidebarState.type === "Plan Details"
            ? "Plan Details"
            : sidebarState.type === "Helper Details"
              ? "Helper Details"
              : sidebarState.type === "Relatives"
                ? "Relatives"
                : sidebarState.type
        }
      >
        {sidebarState.isOpen && sidebarState.type === "Plan Details" ? (
          <PlanDetailsSidebar household={household} />
        ) : null}
        {sidebarState.isOpen && sidebarState.type === "Helper Details" ? (
          <HelperDetailsSidebar household={household} />
        ) : null}
        {sidebarState.isOpen && sidebarState.type === "Relatives" ? (
          <RelativesSidebar household={household} />
        ) : null}
      </ReusableSidebar>
    </div>
  );
};

export default PlanContactDetails;
