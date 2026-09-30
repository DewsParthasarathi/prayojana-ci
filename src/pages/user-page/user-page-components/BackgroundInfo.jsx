import CustomImage from "@/components/image-component/CustomImage";
import downloadIcon from "@assets/images/logos/download.svg";
import pdfIcon from "@assets/images/logos/pdf.svg";
import pdfFile from "@assets/pdf/resume.pdf";
import React from "react";

const BackgroundInfo = ({ users }) => {
  return (
    <>
      <h1 className="text-[2.6rem] font-semibold pb-[1.5rem] border-b border-[#E6E6E6]">
        Background Info
      </h1>
      <div className="flex flex-wrap  items-center pt-[4.7rem] ">
        <div className="w-[20%] pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Referred By</p>
          <p className="text-[1.9rem]">{users.name}</p>
        </div>
        <div className="w-[20%] pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Previous Job Info</p>
          <p className="text-[1.9rem]">{users.personalInfo.address}</p>
        </div>
        <div className="w-[20%] pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Background Check Info</p>
          <p className="text-[1.9rem]">{users.mobile}</p>
        </div>
      </div>
      <div className=" pb-[7.9rem]">
        <h2 className="text-[2rem] font-medium pb-[3rem]">Resume</h2>
        <a
          href={pdfFile}
          download
          className="text-[#0F85E2] text-[1.9rem] cursor-pointer hover:text-blue-800 flex items-center "
        >
          <span className="inline-block w-[3rem] h-[3rem] mr-[1.8rem]">
            <CustomImage src={pdfIcon} alt="pdf" />
          </span>
          {users.name}'s Resume.PDF{" "}
          <span className="inline-block w-[2.3rem] h-[2.3rem] ml-[1.8rem]">
            <CustomImage src={downloadIcon} alt="Resume" />
          </span>
        </a>
      </div>
    </>
  );
};

export default BackgroundInfo;
