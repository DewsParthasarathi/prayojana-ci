import { useEffect, useState } from "react";
import Accordion from "@/components/accordion/Accordion";
import AccordionItemRow from "./AccordionItemRow";

const TABS = [
  { key: "tasks", label: "Tasks" },
  { key: "interactions", label: "Interactions" },
];

const TabsPanel = ({ taskGroups, interactionGroups, onEditItem, onDeleteItem }) => {
  const [activeTab, setActiveTab] = useState("tasks");
  const groups = activeTab === "tasks" ? taskGroups : interactionGroups;

  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line renders
    setOpenIndex(groups.length > 0 ? 0 : -1);
  }, [activeTab]);

  useEffect(() => {
    if (openIndex >= groups.length) {
      // eslint-disable-next-line renders
      setOpenIndex(groups.length > 0 ? 0 : -1);
    }
  }, [groups.length, openIndex]);

  return (
    <div className="w-[36%] h-full bg-white rounded-[10px] p-[2.8rem] flex flex-col gap-[2rem] overflow-hidden">
      <div className="flex items-center gap-[0.6rem] p-[0.6rem] rounded-[10px] bg-[#F0F3F6] w-fit mx-auto justify-center bg-[#E7F1F9] shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-[3.4rem] py-[1rem] rounded-[10px] text-[1.5rem] font-medium transition-all duration-300
              ${
                activeTab === tab.key
                  ? "bg-[#006BBF] text-white shadow-sm"
                  : "text-[#666666] hover:text-[#1B1A1F]"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-[1.2rem] pr-[0.4rem]">
        {groups.length === 0 && (
          <p className="text-[1.4rem] text-[#8A8A8A] text-center mt-[4rem]">
            No {activeTab} found for this data.
          </p>
        )}

        {groups.map((group, groupIndex) => (
          <Accordion
            key={group.name}
            title={`${group.name} (${String(group.count).padStart(2, "0")})`}
            open={openIndex === groupIndex}
            onToggle={(next) => setOpenIndex(next ? groupIndex : -1)}
            className="border border-[#F0F0F0] "
            fillRemaining
          >
            <div>
              {group.items.map((item, index) => (
                <AccordionItemRow
                  key={item.id}
                  title={item.title}
                  timeRange={item.timeRange}
                  isLast={index === group.items.length - 1}
                  onEdit={() => onEditItem?.(activeTab, group.name, item)}
                  onDelete={() => onDeleteItem?.(activeTab, group.name, item)}
                />
              ))}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default TabsPanel;
