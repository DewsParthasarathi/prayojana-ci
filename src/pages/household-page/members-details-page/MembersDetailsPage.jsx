import Accordion from "@/components/accordion/Accordion";
import CardComponent from "@/components/card-component/CardComponent";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReusableSidebar from "@/components/sidebar-drawer/ReusableSidebar";
import DoctorForm from "./doctor-component/DoctorForm";
import HealthCenterForm from "./healthcenter-component/HealthCenterForm";
import InsuranceForm from "./insurance-component/InsuranceForm";
import HealthInfoModal from "./healthinfo-component/HealthInfoModal";
import NotesModal from "../view-forms/NotesModal";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/ConfirmContext.jsx";
import { useHouseholdDetailRefresh } from "@/hooks/householdDetailRefreshContext.jsx";
import CustomImage from "@/components/image-component/CustomImage";
import deleteIcon from "@assets/images/detailspage-img/delete.png";
import editIcon from "@assets/images/detailspage-img/edit.png";
import doctorLogo from "@assets/images/detailspage-img/doctor.svg";
import healthcenterIcon from "@assets/images/detailspage-img/healthcenter.svg";
import insuranceIcon from "@assets/images/detailspage-img/insurance.svg";
import notesIcon from "@assets/images/detailspage-img/notes.svg";
import searchIcon from "@assets/images/detailspage-img/search.png";
import addIcon from "@assets/images/detailspage-img/add.svg";

const MembersDetailsPage = () => {
  const location = useLocation();

  const { household: initialHousehold, data: initialElder } = location.state || {};

  const { currentHousehold, registerCurrentHousehold } = useHouseholdDetailRefresh();
  const { showToast } = useToast();
  const { patch } = useFetch();
  const confirm = useConfirm();

  useEffect(() => {
    if (
      initialHousehold?.id &&
      (!currentHousehold || currentHousehold.id !== initialHousehold.id)
    ) {
      registerCurrentHousehold(initialHousehold);
    }
  }, [initialHousehold?.id]);

  const household = currentHousehold || initialHousehold || null;

  const [selectedElderId, setSelectedElderId] = useState(initialElder?.elder_id || null);

  useEffect(() => {
    if (initialElder?.elder_id) {
      setSelectedElderId(initialElder.elder_id);
    }
  }, [initialElder?.elder_id]);

  const data =
    household?.elders?.find((elder) => elder.elder_id === selectedElderId) ||
    household?.elders?.[0] ||
    null;

  const [sidebarState, setSidebarState] = useState({
    isOpen: false,
    type: null,
    item: null,
    itemIndex: undefined,
  });

  const [isHealthInfoModalOpen, setIsHealthInfoModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const applyElders = (updatedElders) => {
    const base = household || {};
    registerCurrentHousehold({ ...base, elders: updatedElders });
  };

  const handleSidebarUpdated = (updatedElders) => {
    applyElders(updatedElders);
  };

  const handleOpenHealthInfoModal = (event) => {
    event.stopPropagation();
    setIsHealthInfoModalOpen(true);
  };

  const handleCloseHealthInfoModal = () => {
    setIsHealthInfoModalOpen(false);
  };

  const handleOpenNotesModal = (event) => {
    event.stopPropagation();
    setIsNotesModalOpen(true);
  };

  const handleCloseNotesModal = () => {
    setIsNotesModalOpen(false);
  };

  const handleSaveNotes = async (updatedNote) => {
    if (!household?.id || !data?.elder_id) {
      showToast({
        variant: "error",
        description: "Unable to save notes. Member details are missing.",
      });
      return;
    }

    const updatedElders = (household.elders || []).map((elder) =>
      elder.elder_id === data.elder_id ? { ...elder, note: updatedNote } : elder,
    );

    try {
      await patch(`http://localhost:4001/houseHoldData/${household.id}`, {
        elders: updatedElders,
      });

      applyElders(updatedElders);
      showToast({
        variant: "success",
        description: "Notes updated successfully.",
      });
    } catch (err) {
      showToast({
        variant: "error",
        description: err.message || "Failed to update notes.",
      });
    }
  };

  const handleOpenAdd = (type) => (event) => {
    event.stopPropagation();
    setSidebarState({ isOpen: true, type, item: null, itemIndex: undefined });
  };

  const handleOpenEdit = (type, item, index) => (event) => {
    event.stopPropagation();
    setSidebarState({ isOpen: true, type, item, itemIndex: index });
  };

  const handleCloseSidebar = () => {
    setSidebarState({
      isOpen: false,
      type: null,
      item: null,
      itemIndex: undefined,
    });
  };

  const handleDeleteItem = (type, index) => async (event) => {
    event.stopPropagation();

    if (!household?.id || !data?.elder_id) {
      showToast({
        variant: "error",
        description: "Unable to delete item. Member details are missing.",
      });
      return;
    }

    const ok = await confirm({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this item? This action cannot be undone.",
    });
    if (!ok) return;

    const updatedElders = (household.elders || []).map((elder) => {
      if (elder.elder_id !== data.elder_id) {
        return elder;
      }

      if (type === "doctor") {
        const currentItems = Array.isArray(elder.doctors) ? elder.doctors : [];
        return {
          ...elder,
          doctors: currentItems.filter((_, i) => i !== index),
        };
      }

      if (type === "healthCenter") {
        const currentItems = Array.isArray(elder.health_centers) ? elder.health_centers : [];
        return {
          ...elder,
          health_centers: currentItems.filter((_, i) => i !== index),
        };
      }

      const currentItems = Array.isArray(elder.insurance_details) ? elder.insurance_details : [];
      return {
        ...elder,
        insurance_details: currentItems.filter((_, i) => i !== index),
      };
    });

    try {
      await patch(`http://localhost:4001/houseHoldData/${household.id}`, {
        elders: updatedElders,
      });

      applyElders(updatedElders);
      showToast({
        variant: "success",
        description:
          type === "doctor"
            ? "Doctor deleted successfully."
            : type === "healthCenter"
              ? "Health center deleted successfully."
              : "Insurance details deleted successfully.",
      });
    } catch (err) {
      showToast({
        variant: "error",
        description: err.message || "Failed to delete item.",
      });
    }
  };

  const DoctorsCount = data?.doctors?.length;
  const HospitalsCount = data?.health_centers?.length;
  const InsuranceCount = data?.insurance_details?.length;

  if (!household || !data) {
    return <div className="text-[2rem]">Member details are unavailable.</div>;
  }

  return (
    <div className="flex flex-col gap-[5%] h-full  ">
      <div className="name-container  pt-[5.5rem] pb-[6.7rem] h-[20%] ">
        <h2 className="text-[3rem] text-(--black) font-semibold">{data.name}</h2>
        <p className="text-[1.6rem] text-label-gray">
          House Hold {">"} {household.household_name} {">"} {data.name}
        </p>
      </div>
      <div className="rounded-[16px]  bg-[#fff] pl-[9.2rem] pr-[2.5rem]">
        <div className="pt-[5.4rem]">
          <Accordion
            title="Health Info"
            titleActions={
              <div className="action-status-container flex justify-end gap-[2rem] items-center">
                <div
                  onClick={handleOpenHealthInfoModal}
                  role="button"
                  tabIndex={0}
                  className="w-[2rem] h-[2rem] cursor-pointer"
                >
                  <CustomImage src={editIcon} alt="edit icon" />
                </div>

                <p className="text-[2.2rem] font-semibold">
                  <span
                    className={`inline-block mr-[10px] w-[13px] h-[13px] rounded-full
                     ${household?.status == "inProgress" ? "bg-[#22BE4E]" : ""}
                     ${household?.status == "Overdue" ? "bg-[#FA0F19]" : ""}
                    ${household?.status == "Cancelled" ? "bg-[#FCC103]" : ""}
  `}
                  ></span>
                  {household?.status}
                </p>
              </div>
            }
            defaultOpen
          >
            <div className="flex  gap-[9px] mt-[2.2rem]">
              {data?.health_info?.map((item, index) => (
                <p
                  className="text-[13px] p-[5px] rounded-[1.5rem] border-[1px] border-[#D2D2D2] text-[#33333] bg-[#FAFAFA] "
                  key={index}
                >
                  {item}
                </p>
              ))}
            </div>
          </Accordion>
        </div>

        <div className="pt-[5.4rem]">
          <Accordion title="Personality Info" defaultOpen>
            <div className="flex  gap-[9px] mt-[2.2rem]">
              {data?.personality_info?.map((item, index) => (
                <p
                  className="text-[13px] p-[5px] rounded-[1.5rem] border-[1px] border-[#D2D2D2] text-[#33333] bg-[#FAFAFA] "
                  key={index}
                >
                  {item}
                </p>
              ))}
            </div>
          </Accordion>
        </div>

        <div className="pt-[5.4rem]">
          <Accordion title="Notes For Additional Info" defaultOpen>
            <div className="flex text-[1.6rem] gap-[9px] mt-[2.2rem] border-[0.8px] border-[#7070703D] rounded-[8px] pt-[2rem] pl-[3.1rem] pb-[2.5rem] pr-[5.8rem] text-[#11111180]">
              {data?.note}
            </div>
          </Accordion>
        </div>

        <div className="pt-[5.4rem] flex">
          <div className="w-[3.5rem] h-[3.5rem]">
            <CustomImage src={doctorLogo} alt="doctor logo" />
          </div>
          <Accordion
            titleActions={
              <div className="action-status-container flex justify-end gap-[2.6rem] items-center">
                <div
                  onClick={handleOpenAdd("doctor")}
                  role="button"
                  tabIndex={0}
                  className="action-status-container flex justify-end gap-[2.6rem] items-center cursor-pointer"
                >
                  <div className="w-[2rem] h-[2rem]">
                    <CustomImage src={addIcon} alt="add icon" />
                  </div>
                  <div className="">
                    <p className="text-[2.2rem] font-semibold">Add</p>
                  </div>
                </div>
                <div className="w-[2rem] h-[2rem]">
                  <CustomImage src={searchIcon} alt="edit icon" />
                </div>
              </div>
            }
            title={`Doctor Info (${DoctorsCount})`}
            defaultOpen
          >
            <div className="flex flex-wrap gap-[5.4rem]">
              {data?.doctors?.map((doctor, index) => {
                const firstLetter =
                  doctor?.name
                    ?.replace(/^Dr\.?\s*/i, "")
                    ?.charAt(0)
                    ?.toUpperCase() || "?";

                return (
                  <div key={doctor?.name ? `${doctor.name}-${index}` : index}>
                    <CardComponent
                      image={doctor?.image}
                      name={doctor?.name}
                      subTitle={doctor?.Specialization}
                      lastData={doctor?.mobile_number}
                      headingClassName="text-[#000000]"
                      subTitleClassName="text-[#333333]"
                      lastDataClassName="text-[#1287E3]"
                      firstLetter={firstLetter}
                    >
                      <div
                        onClick={handleOpenEdit("doctor", doctor, index)}
                        role="button"
                        tabIndex={0}
                        className="w-[5rem] h-[5rem] flex items-center justify-center bg-[#E8F4FE] rounded-full"
                      >
                        <div className="w-[2rem] h-[2rem]">
                          <CustomImage src={editIcon} />
                        </div>
                      </div>

                      <div
                        onClick={handleDeleteItem("doctor", index)}
                        role="button"
                        tabIndex={0}
                        className="w-[5rem] h-[5rem] flex items-center justify-center bg-[#FFE7E9] rounded-full"
                      >
                        <div className="w-[2rem] h-[2rem]">
                          <CustomImage src={deleteIcon} />
                        </div>
                      </div>
                    </CardComponent>
                  </div>
                );
              })}
            </div>
          </Accordion>
        </div>
        <div className="pt-[5.4rem] flex">
          <div className="w-[3.5rem] h-[3.5rem]">
            <CustomImage src={healthcenterIcon} alt="doctor logo" />
          </div>
          <Accordion
            titleActions={
              <div className="action-status-container flex justify-end gap-[2.6rem] items-center">
                <div
                  onClick={handleOpenAdd("healthCenter")}
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-[0.8rem] cursor-pointer"
                >
                  <div className="w-[2rem] h-[2rem]">
                    <CustomImage src={addIcon} alt="add icon" />
                  </div>
                  <div className="">
                    <p className="text-[2.2rem] font-semibold">Add</p>
                  </div>
                </div>
              </div>
            }
            title={`Health Centers (${HospitalsCount})`}
            defaultOpen
          >
            <div className="flex flex-wrap gap-[5.4rem]">
              {data?.health_centers?.map((hospital, index) => {
                const firstLetter =
                  hospital?.centername
                    ?.replace(/^Dr\.?\s*/i, "")
                    ?.charAt(0)
                    ?.toUpperCase() || "?";

                return (
                  <div key={hospital?.id ?? index}>
                    <CardComponent
                      image={hospital?.image}
                      name={hospital?.centername}
                      subTitle={hospital?.id}
                      lastData={hospital?.telephone_number}
                      headingClassName="text-[#000000]"
                      subTitleClassName="text-[#333333]"
                      lastDataClassName="text-[#1287E3]"
                      firstLetter={firstLetter}
                    >
                      <div
                        onClick={handleOpenEdit("healthCenter", hospital, index)}
                        role="button"
                        tabIndex={0}
                        className="w-[5rem] h-[5rem] flex items-center justify-center bg-[#E8F4FE] rounded-full"
                      >
                        <div className="w-[2rem] h-[2rem]">
                          <CustomImage src={editIcon} />
                        </div>
                      </div>

                      <div
                        onClick={handleDeleteItem("healthCenter", index)}
                        role="button"
                        tabIndex={0}
                        className="w-[5rem] h-[5rem] flex items-center justify-center bg-[#FFE7E9] rounded-full"
                      >
                        <div className="w-[2rem] h-[2rem]">
                          <CustomImage src={deleteIcon} />
                        </div>
                      </div>
                    </CardComponent>
                  </div>
                );
              })}
            </div>
          </Accordion>
        </div>
        <div className="pt-[5.4rem] flex">
          <div className="w-[3.5rem] h-[3.5rem]">
            <CustomImage src={insuranceIcon} alt="doctor logo" />
          </div>
          <Accordion
            titleActions={
              <div className="action-status-container flex justify-end gap-[2.6rem] items-center">
                <div
                  onClick={handleOpenAdd("insurance")}
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-[0.8rem] cursor-pointer"
                >
                  <div className="w-[2rem] h-[2rem]">
                    <CustomImage src={addIcon} alt="add icon" />
                  </div>
                  <div className="">
                    <p className="text-[2.2rem] font-semibold">Add</p>
                  </div>
                </div>
              </div>
            }
            title={`Insurance Details  (${InsuranceCount})`}
            defaultOpen
          >
            <div className="flex flex-wrap gap-[5.4rem]">
              {data?.insurance_details?.map((insurance, index) => {
                const firstLetter =
                  insurance?.insurance_name
                    ?.replace(/^Dr\.?\s*/i, "")
                    ?.charAt(0)
                    ?.toUpperCase() || "?";

                return (
                  <div key={insurance?.id ?? index}>
                    <CardComponent
                      image={insurance?.image}
                      name={insurance?.insurance_name}
                      subTitle={insurance?.id}
                      lastData={insurance?.validity_date}
                      headingClassName="text-[#000000]"
                      subTitleClassName="text-[#333333]"
                      lastDataClassName="text-[#FA0F19]"
                      firstLetter={firstLetter}
                    >
                      <div
                        onClick={handleOpenEdit("insurance", insurance, index)}
                        role="button"
                        tabIndex={0}
                        className="w-[5rem] h-[5rem] flex items-center justify-center bg-[#E8F4FE] rounded-full"
                      >
                        <div className="w-[2rem] h-[2rem]">
                          <CustomImage src={editIcon} />
                        </div>
                      </div>

                      <div
                        onClick={handleDeleteItem("insurance", index)}
                        role="button"
                        tabIndex={0}
                        className="w-[5rem] h-[5rem] flex items-center justify-center bg-[#FFE7E9] rounded-full"
                      >
                        <div className="w-[2rem] h-[2rem]">
                          <CustomImage src={deleteIcon} />
                        </div>
                      </div>
                    </CardComponent>
                  </div>
                );
              })}
            </div>
          </Accordion>
        </div>
        <div className="pt-[5.4rem] pb-[8.5rem] flex">
          <div className="w-[3.5rem] h-[3.5rem]">
            <CustomImage src={notesIcon} alt="doctor logo" />
          </div>
          <Accordion
            title={`Notes For Additional Info`}
            titleActions={
              <div
                onClick={handleOpenNotesModal}
                role="button"
                tabIndex={0}
                className="w-[2rem] h-[2rem] cursor-pointer"
              >
                <CustomImage src={editIcon} alt="edit icon" />
              </div>
            }
            defaultOpen
          >
            <p className="text-[1.8rem] pt-[4rem]">Notes For Additional Info</p>
            <div className="flex text-[1.6rem] gap-[9px] mt-[1rem] border-[0.8px] border-[#7070703D] rounded-[8px] pt-[2rem] pl-[3.1rem] pb-[2.5rem] pr-[5.8rem] text-[#11111180]">
              <p>{data?.note}</p>
            </div>
          </Accordion>
        </div>
      </div>
      <ReusableSidebar
        isOpen={sidebarState.isOpen}
        onClose={handleCloseSidebar}
        title={
          sidebarState.type === "doctor"
            ? sidebarState.item
              ? `Edit ${sidebarState.item.name}`
              : "Create Doctor"
            : sidebarState.type === "healthCenter"
              ? sidebarState.item
                ? "Edit Health Center"
                : "Create Health Center"
              : sidebarState.item
                ? "Edit Insurance"
                : "Create Insurance"
        }
      >
        {sidebarState.isOpen && sidebarState.type === "doctor" ? (
          <DoctorForm
            key={sidebarState.itemIndex ?? "new-doctor"}
            household={household}
            elder={data}
            doctor={sidebarState.item}
            doctorIndex={sidebarState.itemIndex}
            onClose={handleCloseSidebar}
            onSuccess={handleSidebarUpdated}
          />
        ) : null}
        {sidebarState.isOpen && sidebarState.type === "healthCenter" ? (
          <HealthCenterForm
            key={sidebarState.itemIndex ?? "new-healthCenter"}
            household={household}
            elder={data}
            healthCenter={sidebarState.item}
            healthCenterIndex={sidebarState.itemIndex}
            onClose={handleCloseSidebar}
            onSuccess={handleSidebarUpdated}
          />
        ) : null}
        {sidebarState.isOpen && sidebarState.type === "insurance" ? (
          <InsuranceForm
            key={sidebarState.itemIndex ?? "new-insurance"}
            household={household}
            elder={data}
            insurance={sidebarState.item}
            insuranceIndex={sidebarState.itemIndex}
            onClose={handleCloseSidebar}
            onSuccess={handleSidebarUpdated}
          />
        ) : null}
      </ReusableSidebar>

      <HealthInfoModal
        isOpen={isHealthInfoModalOpen}
        household={household}
        elder={data}
        onClose={handleCloseHealthInfoModal}
        onSuccess={applyElders}
      />

      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={handleCloseNotesModal}
        initialNotes={data?.note}
        onSave={handleSaveNotes}
      />
    </div>
  );
};

export default MembersDetailsPage;
