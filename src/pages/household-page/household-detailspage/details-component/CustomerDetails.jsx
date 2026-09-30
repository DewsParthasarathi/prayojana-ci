import CustomImage from "@/components/image-component/CustomImage";
import menImg from "@assets/images/customer-img/men.png";
import womenImg from "@assets/images/customer-img/women.png";
import customerEdit from "@assets/images/logos/customer-edit.png";
import customerDelete from "@assets/images/logos/customer-delete.png";
import customerDetails from "@assets/images/logos/customer-details.png";
import durga from "@assets/images/profile-images/durga.png";
import anjali from "@assets/images/profile-images/anjali.png";
import sreeleela from "@assets/images/profile-images/sreeleela.png";
import emergency from "@assets/images/logos/emergency.svg";
import crown from "@assets/images/logos/plan.svg";
import { useHouseholdDetailRefresh } from "@/hooks/householdDetailRefreshContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/ConfirmContext.jsx";
import { calculateAge } from "@/utils/dateUtils";
const CustomerDetails = ({ household }) => {
  const { householdId } = useParams();
  const navigate = useNavigate();
  const { refreshHouseholdDetail } = useHouseholdDetailRefresh();
  const { patch } = useFetch();
  const { showToast } = useToast();
  const confirm = useConfirm();
  // eslint-disable-next-line no-unused-vars
  const { elders = [], son_contact = {}, care_buddies = [], ...householdDetails } = household || {};
  console.log(son_contact);

  const profileImgs = [menImg, womenImg];
  console.log(household);

  const handleDelete = async (elder) => {
    const ok = await confirm({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this member? This action cannot be undone.",
    });
    if (!ok) return;

    try {
      if (!householdId) {
        throw new Error("Household ID is missing.");
      }

      const updatedElders = elders.filter((item) => item.elder_id !== elder.elder_id);

      await patch(`http://localhost:4001/houseHoldData/${householdId}`, {
        elders: updatedElders,
      });

      await refreshHouseholdDetail();
      showToast({ variant: "success", description: "Member deleted successfully." });
    } catch (err) {
      showToast({
        variant: "error",
        description: err.message || "Failed to delete member.",
      });
    }
  };
  const handleDetails = (data) => {
    navigate("/members-details", {
      state: {
        household,
        data,
      },
    });
  };
  return (
    <>
      {elders.map((data, index) => (
        <div key={index} className="flex w-full justify-between mb-[2%]">
          <div className="flex gap-[5%] w-[40%]">
            <div className="profileImg ">
              <CustomImage src={profileImgs[index]} alt="profileImage" />
            </div>

            <div className="details">
              <div className="flex ">
                <h2 className="text-[3rem] text-(--black) font-bold whitespace-nowrap">
                  {data?.name}
                  <span className="w-[4.2rem] inline-block">
                    <CustomImage src={crown} alt="premium" />
                  </span>
                </h2>
              </div>

              <p className="text-[1.8rem] text-(--black) mb-[1.9rem]">
                {data?.elder_id} {data?.date_of_birth} ({calculateAge(data?.date_of_birth)} yrs)
              </p>
              <div className="flex gap-[1.1rem] items-center">
                <div className="">
                  <CustomImage src={emergency} alt="emergency img" />
                </div>

                <h2 className="text-[1.9rem] font-semibold text-[#FA0F19] ">
                  {son_contact?.contact_number}
                </h2>
              </div>
            </div>
          </div>
          <div className="care-buddies w-[40%] flex items-center gap-[6rem] justify-start">
            {care_buddies?.length > 0 ? (
              care_buddies.map((buddy, index) => (
                <div
                  key={buddy?.id || index}
                  className="flex items-center justify-between mb-[1.2rem] gap-[1.9rem] "
                >
                  <div className="">
                    <CustomImage
                      src={
                        buddy?.name === "Durga"
                          ? durga
                          : buddy?.name === "Sreeleela"
                            ? sreeleela
                            : buddy?.name === "Anjali"
                              ? anjali
                              : null
                      }
                      alt="buddy image"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-[2.3rem]">
                      <p style={{ whiteSpace: "nowrap" }} className="text-[1.6rem]  text-(--black)">
                        Care Buddy
                      </p>

                      <p
                        className={`text-[12px] px-[5px] py-[3px] rounded-md font-medium rounded-[33px] ${
                          index === 0
                            ? "bg-green-100 text-green-700"
                            : index === 1
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {index === 0 ? "Primary" : index === 1 ? "Secondary" : `quaternary `}
                      </p>
                    </div>
                    <h3 className="text-[1.9rem] font-semibold  text-(--black)">{buddy?.name}</h3>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[1.6rem] text-[#999]">No Care Buddy Assigned</p>
            )}
          </div>
          <div className="w-[10%] flex justify-between items-center ">
            <div className="w-[3rem] h-[3rem]" onClick={() => handleDetails(data)}>
              <CustomImage src={customerDetails} alt="details icon" />
            </div>
            <div className="w-[3rem] h-[3rem]">
              <CustomImage src={customerEdit} alt="details icon" />
            </div>
            <div className="w-[3rem] h-[3rem]" onClick={() => handleDelete(data)}>
              <CustomImage src={customerDelete} alt="details icon" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CustomerDetails;
