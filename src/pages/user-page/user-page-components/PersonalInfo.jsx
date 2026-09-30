import React from "react";

const PersonalInfo = ({ users }) => {
  return (
    <>
      <h1 className="text-[2.6rem] font-semibold pb-[1.5rem] border-b border-[#E6E6E6]">
        Employee Info
      </h1>
      <div className="flex flex-wrap  items-center pt-[4.7rem] ">
        <div className="w-[20%] pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Name</p>
          <p className="text-[1.9rem]">{users.name}</p>
        </div>
        <div className="w-[20%] pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Address</p>
          <p className="text-[1.9rem]">{users.personalInfo.address}</p>
        </div>
        <div className="w-[20%] pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Mobile No</p>
          <p className="text-[1.9rem]">{users.mobile}</p>
        </div>
        <div className="w-[20%] pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Alternate Mobile No</p>
          <p className="text-[1.9rem]">{users.personalInfo.alternateMobileNo}</p>
        </div>
        <div className="w-[20%] pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Personal Email Id</p>
          <p className="text-[1.9rem]">{users.email}</p>
        </div>
        <div className="w-[20%] pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Blood Group</p>
          <p className="text-[1.9rem]">{users.personalInfo.bloodGroup}</p>
        </div>
        <div className="w-[20%] pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Date of Birth</p>
          <p className="text-[1.9rem]">{users.personalInfo.dateOfBirth}</p>
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;
