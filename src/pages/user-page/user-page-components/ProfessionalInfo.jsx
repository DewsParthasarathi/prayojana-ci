import React from "react";
import sslc from "@assets/images/certificates/10th.png";
import hsc from "@assets/images/certificates/12th.png";
import consolidate from "@assets/images/certificates/consolidate.png";
import provisinal from "@assets/images/certificates/provisinal.png";
import CustomImage from "@/components/image-component/CustomImage";

const ProfessionalInfo = ({ users }) => {
  const certificates = [
    {
      id: "1",
      name: "SSLC",
      image: sslc,
    },
    {
      id: "2",
      name: "HSC",
      image: hsc,
    },
    {
      id: "3",
      name: "Consolidate",
      image: consolidate,
    },
    {
      id: "4",
      name: "Provisinal",
      image: provisinal,
    },
  ];

  return (
    <>
      <h1 className="text-[2.6rem] font-semibold pb-[1.5rem] border-b border-[#E6E6E6]">
        Professional Info
      </h1>
      <div className="flex flex-wrap gap-[6.8rem] items-center pt-[4.7rem] ">
        <div className=" pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Educational Qualification</p>
          <p className="text-[1.9rem]">{users.professionalInfo.educationalQualification}</p>
        </div>
        <div className=" pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Language Known</p>
          <p className="text-[1.9rem]">{users.professionalInfo.languagesKnown}</p>
        </div>
        <div className=" pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Skills</p>
          <p className="text-[1.9rem]">{users.professionalInfo.skills}</p>
        </div>
      </div>
      <div className="pb-[8.9rem]">
        <h2 className="text-[2rem] pb-[3rem] font-medium">Certificates</h2>
        <div className="flex gap-[3.8rem]">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="group relative w-[16%] overflow-hidden rounded-[10px] cursor-pointer"
            >
              <CustomImage
                src={certificate.image}
                alt={certificate.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-white text-[2rem] font-medium text-center px-2">
                  {`${certificate.name}  certificate`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfessionalInfo;
